<template>
  <div class="page pr-2">
    <article class="cell cell-map">
      <b-overlay :show="showOverlay" rounded="sm">
        <client-only>
          <OlMap
            :map-features="mapFeatures"
            :zoom-out="zoomOut"
            :editable.sync="editable"
            :info.sync="info"
            :add.sync="add"
            :add-fearures="addFearures"
            @featuresload="setShowOverlay"
            @modify="setModifyFearures"
            @add="setAddFearures"
            @delete="setDeleteFearures"
            @deleteAddFeature="setDeleteFearures"
          ></OlMap>
        </client-only>
      </b-overlay>
    </article>
    <aside class="cell cell-edit card">
      <div class="list-group container-list mb-3">
        <a href="#" class="list-group-item list-group-item-action disabled">
          -- Selecione uma opção --
        </a>
        <a
          v-for="item in listFeatures"
          :key="item.id"
          href="#"
          class="list-group-item list-group-item-action"
          :class="item.id === selectedFeature ? 'active' : ''"
          aria-disabled="true"
          @click.prevent="
            () => {
              selectedFeature = item.id;
            }
          "
        >
          {{ item.name }}
        </a>
      </div>
      <div class="row content-">
        <div class="col d-flex justify-content-center">
          <b-form-group v-slot="{ ariaDescribedby }" label="Ações:">
            <b-form-radio-group
              id="btn-radios-1"
              v-model="actionSelected"
              :aria-describedby="ariaDescribedby"
              name="radios-btn-default"
              buttons
            >
              <b-form-radio value="view" button-variant="outline-warning">
                Ver <b-icon icon="eye" aria-hidden="true"></b-icon>
              </b-form-radio>
              <b-form-radio value="edit" button-variant="outline-success">
                Editar
                <b-icon icon="bounding-box-circles" aria-hidden="true"></b-icon>
              </b-form-radio>
              <b-form-radio value="info" button-variant="outline-info">
                Info <b-icon icon="info-square" aria-hidden="true"></b-icon>
              </b-form-radio>
              <b-form-radio value="add" button-variant="outline-danger">
                Novo <b-icon icon="file-earmark" aria-hidden="true"></b-icon>
              </b-form-radio>
            </b-form-radio-group>
          </b-form-group>
        </div>
      </div>
    </aside>
    <aside class="cell cell-inspect card">
      <div v-if="modifyFearures != null" class="m-1 p-1 container-list">
        <details
          v-for="(feature, index) in modifyFearures"
          :key="feature.id"
          class="bg-success text-white p-1 rounded"
        >
          <summary>
            <span class="ml-1">{{ feature.properties.name }}</span>
            <b-icon icon="pencil" class="ml-1"></b-icon>
            <b-button
              size="sm"
              variant="danger"
              class="ml-1 p-0"
              @click="deleteItemModify(index)"
            >
              <b-icon icon="x-circle" class="m-1"></b-icon>
            </b-button>
            Editado
          </summary>
          <div class="form-group">
            <label :for="`name${feature.id}`">Nome:</label>
            <input
              :id="`name${feature.id}`"
              v-model="feature.properties.name"
              type="text"
              class="form-control"
              placeholder="name"
            />
          </div>
        </details>
      </div>
      <div v-if="addFearures != null" class="m-1 p-1 container-list">
        <details
          v-for="(feature, index) in addFearures"
          :key="feature.id"
          class="bg-danger text-white p-1 rounded"
        >
          <summary>
            <span class="ml-1">{{ feature.properties.name }}</span>
            <b-icon icon="pencil" class="ml-1"></b-icon>
            <b-button
              size="sm"
              variant="success"
              class="ml-1 p-0"
              @click="deleteItemAdd(index)"
            >
              <b-icon icon="x-circle" class="m-1"></b-icon>
            </b-button>
            Novo
          </summary>
          <div class="form-group">
            <label :for="`name${feature.id}`">Nome:</label>
            <input
              :id="`name${feature.id}`"
              v-model="feature.properties.name"
              type="text"
              class="form-control"
              placeholder="name"
            />
          </div>
        </details>
      </div>
      <div v-if="deleteFearures != null" class="m-1 p-1 container-list">
        <details
          v-for="(feature, index) in deleteFearures"
          :key="feature.id"
          class="bg-dark text-white p-1 rounded"
        >
          <summary>
            <span class="ml-1">{{ feature.properties.name }}</span>
            <b-icon icon="pencil" class="ml-1"></b-icon>
            <b-button
              size="sm"
              variant="warning"
              class="ml-1 p-0"
              @click="deleteItemDeletend(index)"
            >
              <b-icon icon="x-circle" class="m-1"></b-icon>
            </b-button>
            Novo
          </summary>
          <div class="form-group">
            <label :for="`name${feature.id}`">Nome:</label>
            <input
              :id="`name${feature.id}`"
              v-model="feature.properties.name"
              type="text"
              class="form-control"
              placeholder="name"
            />
          </div>
        </details>
      </div>
    </aside>
  </div>
</template>

<script>
export default {
  name: 'TypePage',
  data() {
    return {
      selectedFeature: null,
      listFeatures: [],
      mapFeatures: [],
      showOverlay: false,
      zoomOut: 0.5,
      editable: false,
      info: false,
      add: false,
      modifyFearures: null,
      addFearures: null,
      deleteFearures: null,
      actionSelected: null,
    };
  },
  watch: {
    selectedFeature(val) {
      this.selectOption(val);
    },
    actionSelected(val) {
      this.editable = false;
      this.info = false;
      this.add = false;

      if (val === 'edit') {
        this.editable = true;
      }

      if (val === 'info') {
        this.info = true;
      }

      if (val === 'add') {
        this.add = true;
      }
    },
  },
  beforeMount() {
    if (this.$route.params.type === 'block') {
      this.zoomOut = 4;
    }
  },
  mounted() {
    this.getFeature(this.$route.params.type);
  },
  methods: {
    async getFeatureGeojson(type) {
      this.showOverlay = true;
      this.mapFeatures = [];

      const response = await this.$axios.get(`map/${type}`, {
        params: {
          type: 'geojson',
          id: this.selectedFeature,
        },
      });
      const maps = response.data;

      const mapFeatures = [];
      for (const map of maps) {
        mapFeatures.push({
          type: 'Feature',
          id: map.id,
          gid: map.gid,
          geometry: JSON.parse(map.geojson),
          name: map.name,
          properties: {
            id: map.id,
            name: map.name,
            gid: map.gid,
          },
        });
      }

      this.mapFeatures = [...mapFeatures];
    },
    async getFeature(type) {
      this.listFeatures = [];

      const response = await this.$axios.get(`map/${type}`, {
        params: {
          type: 'list',
        },
      });
      this.listFeatures = response.data;
    },
    setShowOverlay(status) {
      this.showOverlay = status;
    },
    selectOption(option) {
      this.actionSelected = 'view';
      this.getFeatureGeojson(this.$route.params.type);
    },
    setModifyFearures(newFeatures) {
      // console.log(JSON.parse(newFeatures));
      newFeatures = JSON.parse(newFeatures);

      if (this.modifyFearures != null) {
        newFeatures.features.forEach((newFeature) => {
          const index = this.modifyFearures.findIndex(
            (modifyFearure) => modifyFearure.id === newFeature.id
          );

          if (index !== -1) {
            this.modifyFearures.splice(index, 1);
          }
          this.modifyFearures.push(newFeature);
        });
      } else {
        this.modifyFearures = newFeatures.features;
      }
      for (const feature of this.modifyFearures) {
        console.log(feature);
      }
    },
    setAddFearures(newFeatures) {
      // console.log(JSON.parse(newFeatures));
      newFeatures = JSON.parse(newFeatures);

      if (this.addFearures != null) {
        newFeatures.features.forEach((newFeature) => {
          const index = this.addFearures.findIndex(
            (addFearure) => addFearure.id === newFeature.id
          );

          if (index !== -1) {
            this.addFearures.splice(index, 1);
          }
          this.addFearures.push(newFeature);
        });
      } else {
        this.addFearures = newFeatures.features;
      }
      for (const feature of this.addFearures) {
        console.log(feature);
      }
    },
    setDeleteFearures(featureCollection) {
      // console.log(JSON.parse(newFeatures));
      const collection = JSON.parse(featureCollection);
      for (const feature of collection.features) {
        console.log(feature);
        if (feature.id !== undefined) {
          const index = this.modifyFearures.findIndex(
            (modifyFearure) => modifyFearure.id === feature.id
          );
          this.deleteItemModify(index);
        } else {
          this.deleteItemAdd(feature.properties.index);
        }
      }
    },
    deleteItemModify(index) {
      this.modifyFearures.splice(index, 1);
    },
    deleteItemAdd(index) {
      this.addFearures.splice(index, 1);
    },
    deleteItemDeletend(index) {
      this.deleteFearures.splice(index, 1);
    },
  },
};
</script>
<style scoped>
.page {
  height: 100%;
  display: grid;
  grid-template-columns: 100vh;
  grid-auto-rows: 1fr;
  grid-gap: 1rem;
  padding: 1rem;
  box-sizing: border-box;
}

.cell {
  border-radius: 4px;
}

.cell-map {
  grid-column: 1;
  grid-row: 1 / 3;
}

.cell-edit {
  grid-column: 2;
  grid-row: 1;
}

.cell-inspect {
  grid-column: 2;
  grid-row: 2;
}

.container-list {
  max-height: 30vh;
  overflow: auto;
}
</style>

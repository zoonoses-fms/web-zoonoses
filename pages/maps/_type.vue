<template>
  <div class="page pr-2">
    <article class="cell cell-map">
      <b-overlay :show="showOverlay" rounded="sm">
        <client-only>
          <LazyOlMap
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
          ></LazyOlMap>
        </client-only>
      </b-overlay>
    </article>
    <aside class="cell cell-edit">
      <div class="card p-1 content-location">
        <div
          v-if="$route.params.type != 'saad'"
          class="accordion"
          role="tablist"
        >
          <BCard
            v-for="item in listFeatures"
            :key="item.id"
            no-body
            class="mb-1"
          >
            <BCardHeader header-tag="header" class="p-1" role="tab">
              <b-button
                v-b-toggle="`accordion-${item.id}`"
                block
                variant="info"
                @click.prevent="
                  () => {
                    selectedRegion = item.id;
                  }
                "
              >
                {{ item.name }}
              </b-button>
            </BCardHeader>
            <BCollapse
              :id="`accordion-${item.id}`"
              accordion="region"
              role="tabpanel"
            >
              <div class="list-group container-list mb-3">
                <a
                  v-for="neighborhood in item.neighborhoods"
                  :key="neighborhood.id"
                  href="#"
                  class="list-group-item list-group-item-action"
                  :class="neighborhood.id === selectedFeature ? 'active' : ''"
                  aria-disabled="true"
                  @click.prevent="
                    () => {
                      selectedFeature = neighborhood.id;
                    }
                  "
                >
                  {{ neighborhood.name }}
                </a>
              </div>
            </BCollapse>
          </BCard>
        </div>
        <div v-else class="list-group container-list mb-3">
          <a class="list-group-item list-group-item-action disabled">
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
      </div>
      <div class="card p-1">
        <div class="row px-3">
          <div class="col-12 col-md-6 p-1">
            <div
              class="custom-control custom-switch alert-warning border border-warning rounded"
            >
              <input
                id="action-view"
                v-model="actionSelected"
                type="radio"
                value="view"
                class="custom-control-input"
                :disabled="isDisableAction"
              />
              <label class="custom-control-label" for="action-view">Ver</label>
            </div>
          </div>
          <div class="col-12 col-md-6 p-1">
            <div
              class="custom-control custom-switch alert-info border border-info rounded"
            >
              <input
                id="action-info"
                v-model="actionSelected"
                type="radio"
                value="info"
                class="custom-control-input"
                :disabled="isDisableAction"
              />
              <label class="custom-control-label" for="action-info">Info</label>
            </div>
          </div>
          <div class="col-12 col-md-6 p-1">
            <div
              class="custom-control custom-switch alert-success border border-success rounded"
            >
              <input
                id="action-edit"
                v-model="actionSelected"
                type="radio"
                value="edit"
                class="custom-control-input"
                :disabled="isDisableAction"
              />
              <label class="custom-control-label" for="action-edit"
                >Editar</label
              >
            </div>
          </div>
          <div class="col-12 col-md-6 p-1">
            <div
              class="custom-control custom-switch alert-danger border border-danger rounded"
            >
              <input
                id="action-add"
                v-model="actionSelected"
                type="radio"
                value="add"
                class="custom-control-input"
                :disabled="isDisableAction"
              />
              <label class="custom-control-label" for="action-add">
                Criar
              </label>
            </div>
          </div>
        </div>
        <a href="#" class="btn btn-primary my-1" @click.prevent="saveOrUpdate">
          Salvar
        </a>
      </div>
    </aside>
    <aside class="cell cell-inspect card">
      <div v-if="modifyFearures != null" class="m-1 p-1 container-list">
        <details
          v-for="(feature, index) in modifyFearures"
          :key="feature.id"
          class="bg-success text-white p-1 rounded border border-light"
        >
          <summary>
            <span class="ml-1">{{ feature.properties.name }}</span>
            <b-icon-pencil class="ml-1"></b-icon-pencil>
            <b-button
              size="sm"
              variant="danger"
              class="ml-1 p-0"
              @click="deleteItemModify(index)"
            >
              <b-icon-x-circle class="m-1"></b-icon-x-circle>
            </b-button>
            Editado
          </summary>
          <div v-if="$route.params.type !== 'block'" class="form-group">
            <label :for="`name${feature.id}`">Nome:</label>
            <input
              :id="`name${feature.id}`"
              v-model="feature.properties.name"
              type="text"
              class="form-control"
              placeholder="name"
            />
          </div>
          <div v-else class="form-group">
            <label :for="`name${feature.id}`">Número:</label>
            <input
              :id="`name${feature.id}`"
              v-model="feature.properties.name"
              type="number"
              class="form-control"
              placeholder="número"
            />
            <label :for="`name${feature.id}`">Descrição:</label>
            <input
              :id="`name${feature.id}`"
              v-model="feature.properties.description"
              type="text"
              class="form-control"
              placeholder="Descrição"
            />
          </div>
        </details>
      </div>
      <div v-if="addFearures != null" class="m-1 p-1 container-list">
        <details
          v-for="(feature, index) in addFearures"
          :key="feature.id"
          class="bg-danger text-white p-1 rounded border border-light"
        >
          <summary>
            <span class="ml-1">{{ feature.properties.name }}</span>
            <b-icon-pencil class="ml-1"></b-icon-pencil>
            <b-button
              size="sm"
              variant="success"
              class="ml-1 p-0"
              @click="deleteItemAdd(index)"
            >
              <b-icon-x-circle class="m-1"></b-icon-x-circle>
            </b-button>
            Novo
          </summary>
          <div v-if="$route.params.type !== 'block'" class="form-group">
            <label :for="`name${feature.id}`">Nome:</label>
            <input
              :id="`name${feature.id}`"
              v-model="feature.properties.name"
              type="text"
              class="form-control"
              placeholder="name"
            />
          </div>
          <div v-else class="form-group">
            <label :for="`name${feature.id}`">Número:</label>
            <input
              :id="`name${feature.id}`"
              v-model="feature.properties.name"
              type="number"
              class="form-control"
              placeholder="número"
            />
            <label :for="`name${feature.id}`">Descrição:</label>
            <input
              :id="`name${feature.id}`"
              v-model="feature.properties.description"
              type="text"
              class="form-control"
              placeholder="Descrição"
            />
          </div>
        </details>
      </div>
      <div v-if="deleteFearures != null" class="m-1 p-1 container-list">
        <details
          v-for="(feature, index) in deleteFearures"
          :key="feature.id"
          class="bg-dark text-white p-1 rounded border border-light"
        >
          <summary>
            <span class="ml-1">{{ feature.properties.name }}</span>
            <b-icon-pencil class="ml-1"></b-icon-pencil>
            <b-button
              size="sm"
              variant="warning"
              class="ml-1 p-0"
              @click="deleteItemDeletend(index)"
            >
              <b-icon-x-circle class="m-1"></b-icon-x-circle>
            </b-button>
            Deletado
          </summary>
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
      selectedRegion: null,
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
  computed: {
    isDisableAction() {
      if (this.$route.params.type === 'saad') {
        return false;
      }

      if (
        this.$route.params.type === 'neighborhood' &&
        this.selectedRegion !== null
      ) {
        return false;
      }

      if (this.selectedFeature !== null) {
        return false;
      }

      return true;
    },
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
    selectedRegion(val) {
      // console.log(val);
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

      if (this.$route.params.type !== 'block') {
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
      } else {
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
              description: map.description,
              gid: map.gid,
            },
          });
        }
      }

      this.mapFeatures = [...mapFeatures];
      this.showOverlay = false;
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

      for (const feature of newFeatures.features) {
        feature.properties.region_id = this.selectedRegion;
        feature.properties.feature_id = this.selectedFeature;
      }

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
    },
    setAddFearures(newFeatures) {
      // console.log(JSON.parse(newFeatures));
      newFeatures = JSON.parse(newFeatures);

      for (const feature of newFeatures.features) {
        feature.properties.region_id = this.selectedRegion;
        feature.properties.feature_id = this.selectedFeature;
      }

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
    },
    setDeleteFearures(featureCollection) {
      // console.log(JSON.parse(newFeatures));
      const collection = JSON.parse(featureCollection);

      for (const feature of collection.features) {
        if (feature.id !== undefined) {
          if (Array.isArray(this.modifyFearures)) {
            const index = this.modifyFearures.findIndex(
              (modifyFearure) => modifyFearure.id === feature.id
            );

            if (index !== -1) {
              this.deleteItemModify(index);
            }
          }

          if (this.deleteFearures != null) {
            this.deleteFearures.push(feature);
          } else {
            this.deleteFearures = [feature];
          }
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
    async saveOrUpdate() {
      const type = this.$route.params.type;
      this.showOverlay = true;

      if (
        Array.isArray(this.modifyFearures) &&
        this.modifyFearures.length > 0
      ) {
        const listModifySuccess = [];

        for (const [index, feature] of this.modifyFearures.entries()) {
          try {
            const response = await this.$axios.put(
              `map/${type}/${feature.id}`,
              feature
            );
            this.user = response.data;
            this.$bvToast.toast('Item atualizado!', {
              title: 'Sucesso',
              autoHideDelay: 5000,
              variant: 'success',
              solid: true,
            });
            listModifySuccess.push(index);
          } catch (errors) {
            for (const prop in errors.response.data) {
              errors.response.data[prop].forEach((element) => {
                this.$bvToast.toast(`${element}: ${feature}`, {
                  title: 'Error',
                  autoHideDelay: 5000,
                  variant: 'danger',
                  solid: true,
                });
              });
            }
          }
        }

        listModifySuccess.forEach((i) => {
          this.deleteItemModify(i);
        });
      }

      if (Array.isArray(this.addFearures) && this.addFearures.length > 0) {
        const listAddSuccess = [];

        for (const [index, feature] of this.addFearures.entries()) {
          if (feature.properties.name || feature.properties.name.length > 0) {
            try {
              const response = await this.$axios.post(`map/${type}`, feature);
              this.user = response.data;
              this.$bvToast.toast('Item criado!', {
                title: 'Sucesso',
                autoHideDelay: 5000,
                variant: 'success',
                solid: true,
              });
              listAddSuccess.push(index);
            } catch (errors) {
              for (const prop in errors.response.data) {
                errors.response.data[prop].forEach((element) => {
                  this.$bvToast.toast(`${element}: ${feature}`, {
                    title: 'Error',
                    autoHideDelay: 5000,
                    variant: 'danger',
                    solid: true,
                  });
                });
              }
            }
          } else {
            this.$bvToast.toast(`Verifique o nome dos polygnos`, {
              title: 'Error',
              autoHideDelay: 5000,
              variant: 'danger',
              solid: true,
            });
          }
        }

        listAddSuccess.forEach((i) => {
          this.deleteItemAdd(i);
        });
      }

      if (
        Array.isArray(this.deleteFearures) &&
        this.deleteFearures.length > 0
      ) {
        const listDeleteSuccess = [];

        for (const [index, feature] of this.deleteFearures.entries()) {
          try {
            const response = await this.$axios.delete(
              `map/${type}/${feature.id}`
            );
            this.user = response.data;
            this.$bvToast.toast('Item deletado!', {
              title: 'Sucesso',
              autoHideDelay: 5000,
              variant: 'success',
              solid: true,
            });
            listDeleteSuccess.push(index);
          } catch (errors) {
            for (const prop in errors.response.data) {
              errors.response.data[prop].forEach((element) => {
                this.$bvToast.toast(`${element}: ${feature}`, {
                  title: 'Error',
                  autoHideDelay: 5000,
                  variant: 'danger',
                  solid: true,
                });
              });
            }
          }
        }

        listDeleteSuccess.forEach((i) => {
          this.deleteItemDeletend(i);
        });
      }

      this.getFeature(this.$route.params.type);
      this.showOverlay = false;
    },
  },
};
</script>
<style scoped>
.page {
  height: 100%;
  display: grid;
  grid-template-columns: 3fr 1fr;
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

.content-location {
  max-height: 30vh;
  overflow: auto;
}
</style>

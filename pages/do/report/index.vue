<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-12 col-md-2">
          <b-form-group description="Data início da pesquisa">
            <b-form-input
              v-model="searchDate.start"
              placeholder="Inicio"
              name="search-date-start"
              type="date"
            ></b-form-input>
          </b-form-group>
        </div>
        <div class="col-sm-12 col-md-2">
          <b-form-group description="Data fim da pesquisa" :state="stateDate">
            <b-form-input
              v-model="searchDate.end"
              placeholder="Fim"
              name="search-date-end"
              type="date"
              :state="stateDate"
            ></b-form-input>
          </b-form-group>
        </div>
        <div class="col-sm-12 col-md-1 p-0 mx-1">
          <b-button class="mt-0" variant="success" @click="getHealthUnit"
            >Filtrar por data</b-button
          >
        </div>
        <div class="col-sm-12 col-md-1 p-0 mx-1">
          <b-button class="mt-0" variant="danger" @click="exportData"
            >Exportar</b-button
          >
        </div>
        <div class="col-sm-12 col-md-1 p-0 mx-1">
          <b-button class="mt-0" variant="warning" @click="reportPdf"
            >Relatório</b-button
          >
        </div>
        <div class="col-sm-12 col-md-4">
          <b-form-group description="Termo para pesquisa">
            <b-input-group>
              <b-form-input
                v-model="search"
                placeholder="Buscar..."
                type="search"
                @input="searchHandler"
              ></b-form-input>
              <b-input-group-append>
                <b-input-group-text>
                  <b-icon icon="search" />
                </b-input-group-text>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </div>
      </div>
      <div class="row justify-content-between">
        <div class="col-12">
          <b-card class="text-center">
            <b-table
              id="table-healt-unit"
              striped
              hover
              :fields="fields"
              :items="listHealthUnit"
              :busy="isBusy"
              primary-key="cnes_code"
              :tbody-transition-props="transProps"
            >
              <template #cell(id)="data">
                {{ data.item.cnes_code }}
              </template>
              <template #cell(name)="data">
                {{ data.item.name }}
              </template>
              <template #cell(received)="data">
                {{ data.item.received }}
              </template>
              <template #cell(stock)="data">
                {{ data.item.stock }}
              </template>
              <template #cell(used)="data">
                {{ data.item.used }}
              </template>
              <template #cell(canceled)="data">
                {{ data.item.canceled }}
              </template>
              <template #cell(latitude)="data">
                {{ data.item.latitude }}
              </template>
              <template #cell(longitude)="data">
                {{ data.item.longitude }}
              </template>
              <template #cell(action)="data">
                <b-button
                  class="mt-0"
                  variant="danger"
                  @click="exportDataByHealthUnit(data.item)"
                  >Exportar</b-button
                >
                <b-button
                  class="mt-0"
                  variant="warning"
                  @click="reportByHealthUnitPdf(data.item)"
                  >Relatório</b-button
                >
              </template>
            </b-table>
          </b-card>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 col-md-6">
          <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            class="pagination-danger"
            @input="getHealthUnit"
          ></b-pagination>
        </div>
        <div class="col-sm-12 col-md-2">
          <b-form-select
            v-model="perPage"
            :options="perPageOptions"
            @change="getHealthUnit"
          ></b-form-select>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <client-only placeholder="Loading...">
            <vl-map
              :load-tiles-while-animating="true"
              :load-tiles-while-interacting="true"
              data-projection="EPSG:4326"
              style="height: 500px"
            >
              <vl-view
                :zoom.sync="zoom"
                :center.sync="center"
                :rotation.sync="rotation"
              ></vl-view>
              <vl-layer-vector id="layer-marker" :z-index="1">
                <vl-source-vector
                  id="vector-marker"
                  :features="healthUnitFeatures"
                  ident="vectorMarker"
                >
                  <template v-for="healthUnit in listHealthUnit">
                    <vl-feature
                      v-if="healthUnit.latitude && healthUnit.longitude"
                      :id="`marker-${healthUnit.cnes_code}`"
                      :ref="`marker-${healthUnit.cnes_code}`"
                      :key="healthUnit.cnes_code"
                    >
                      <vl-geom-point
                        :coordinates="[
                          parseFloat(healthUnit.longitude),
                          parseFloat(healthUnit.latitude),
                        ]"
                      ></vl-geom-point>
                      <vl-style>
                        <vl-style-icon
                          :src="marker"
                          :scale="0.4"
                          :anchor="[0.5, 1]"
                        ></vl-style-icon>
                      </vl-style>
                      <vl-overlay
                        :position="[
                          parseFloat(healthUnit.longitude),
                          parseFloat(healthUnit.latitude),
                        ]"
                        :offset="[-38.5, -66]"
                      >
                        <circle-progress
                          :transition-duration="5000"
                          :radius="30"
                          :stroke-width="10"
                          :value="healthUnit.percent"
                          :stroke-color="healthUnit.color"
                        >
                          <div class="content">
                            {{ healthUnit.stock }}
                          </div>
                        </circle-progress>
                        <p class="is-light box content-map">
                          <strong>{{ healthUnit.name }}</strong>
                        </p>
                      </vl-overlay>
                    </vl-feature>
                  </template>
                </vl-source-vector>
              </vl-layer-vector>
              <!--
              <vl-interaction-modify source="vectorMarker">
                <vl-style>
                  <vl-style-circle :radius="5">
                    <vl-style-stroke color="green"></vl-style-stroke>
                    <vl-style-fill color="green"></vl-style-fill>
                  </vl-style-circle>
                </vl-style>
              </vl-interaction-modify>
              -->
              <vl-layer-tile id="osm">
                <vl-source-osm></vl-source-osm>
              </vl-layer-tile>
            </vl-map>
            <div style="padding: 20px">
              Zoom: {{ zoom }}<br />
              Center: {{ center }}<br />
              Rotation: {{ rotation }}<br />
              healthUnitFeature: {{ healthUnitFeatures }}
            </div>
          </client-only>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import filters from '@/mixins/filters';
import pagination from '@/mixins/pagination';
import exports from '@/mixins/exports';
import reports from '@/mixins/reports';

export default {
  name: 'DoReport',
  components: {},
  mixins: [filters, exports, reports, pagination],
  data() {
    return {
      module: 'do',
      url: 'death_certificate_form/report/',
      marker: require('@/assets/img/marker.png'),
      isBusy: false,
      isLoad: false,
      features: [],
      fields: [
        { key: 'cnes_code', label: 'CNES', sortable: true },
        { key: 'name', label: 'Nome', sortable: true },
        { key: 'received', label: 'Recebidos', sortable: true },
        { key: 'used', label: 'Utilizados', sortable: true },
        { key: 'canceled', label: 'Cancelados', sortable: true },
        { key: 'stock', label: 'Estoque', sortable: true },
        { key: 'last_receipt', label: 'Último recebimento', sortable: true },
        {
          key: 'last_receipt_day',
          label: 'Dias Último recebimento',
          sortable: true,
        },
        { key: 'action', label: 'Ações', sortable: false },
      ],
      transProps: {
        // Transition name
        name: 'flip-list',
      },
      selectedHealthUnit: [],
      listHealthUnit: [],
      perPage: 10,
      currentPage: 1,
      totalRows: 0,
      search: '',
      pathImages: this.$store.state.paths.pathImages,
      perPageOptions: [5, 10, 50, 100],
      zoom: 12.5,
      center: [-42.76189556281046, -5.075455784017862],
      rotation: 0,
      geolocPosition: undefined,
      healthUnitFeatures: [],
      searchDate: {
        start: null,
        end: null,
      },
    };
  },
  async fetch() {
    this.isBusy = !this.isBusy;
    const response = await this.$axios.get(this.url, {
      params: this.params,
    });
    await response.data.data.forEach((healthUnit) => {
      healthUnit.percent =
        (healthUnit.stock_form_alive / 100) * healthUnit.stock;

      if (healthUnit.percent > 100) {
        healthUnit.percent = 100;
      }

      if (healthUnit.percent >= 75) {
        healthUnit.color = '#87CB16';
      } else if (healthUnit.percent < 75 && healthUnit.percent > 25) {
        healthUnit.color = '#FFA534';
      } else {
        healthUnit.color = '#FB404B';
      }

      this.listHealthUnit.push(healthUnit);
    });
    // this.listHealthUnit = await response.data.data;
    this.totalRows = await response.data.total;
    this.isBusy = !this.isBusy;
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.loggedIn;
    },
    isSuperuser() {
      if (this.$store.state.auth.user.is_superuser) {
        return true;
      } else {
        return false;
      }
    },
    stateDate() {
      if (this.searchDate.end != null) {
        const start = new Date(this.searchDate.start);
        const end = new Date(this.searchDate.end);
        if (start > end) {
          return false;
        }
        return null;
      }
      return null;
    },
  },
  created() {
    this.welcomeMessage();
  },
  mounted() {
    if (!this.loggedIn) {
      this.$router.push('/auth/login');
    }
    // this.getHealthUnit();
  },
  methods: {
    welcomeMessage() {
      this.$store.commit('layout/CHANGE_NAV_TITLE', 'Usuários');
    },
    selectAll() {
      this.listHealthUnit.forEach((healthUnit) => {
        this.selectedHealthUnit.push(healthUnit.id);
      });
    },
    async getHealthUnit() {
      this.isBusy = !this.isBusy;
      const response = await this.$axios.get(
        `death_certificate_form/report/${this.genPage()}${this.genSearch()}${this.genFilterDate()}`
      );
      this.listHealthUnit = [];
      await response.data.data.forEach((healthUnit) => {
        healthUnit.percent =
          (healthUnit.stock_form_alive / 100) * healthUnit.stock;

        if (healthUnit.percent > 100) {
          healthUnit.percent = 100;
        }

        if (healthUnit.percent > 75) {
          healthUnit.color = '#87CB16';
        } else if (healthUnit.percent < 75 && healthUnit.percent > 50) {
          healthUnit.color = '#FFA534';
        } else if (healthUnit.percent < 50 && healthUnit.percent > 25) {
          healthUnit.color = '#f96332';
        } else {
          healthUnit.color = '#FB404B';
        }

        this.listHealthUnit.push(healthUnit);
      });
      // this.listHealthUnit = await response.data.data;
      this.totalRows = await response.data.total;
      this.isBusy = !this.isBusy;
    },
    searchHandler() {
      this.getHealthUnit();
    },
  },
};
</script>
<style>
table #table-users .flip-list-move {
  transition: transform 1s;
}

#layer-marker {
  z-index: 1;
}

.content {
  background-color: transparent;
  padding-top: 0;
  margin-top: -5px;
}

.content-map {
  background-color: rgb(244 243 239 / 70%);
  min-height: 100%;
  padding: 1px;
}
</style>

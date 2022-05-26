<template>
  <div class="container-fluid">
    <b-sidebar id="filters" title="Filtros" width="368px" right shadow>
      <div class="px-3 py-2">
        <CardsCids
          :loading.sync="loading"
          store="sim"
          @update="setAllFilters"
        ></CardsCids>
      </div>
    </b-sidebar>
    <b-navbar toggleable="md" type="dark" variant="dark">
      <b-navbar-brand>
        <b-button v-b-toggle.filters size="sm">
          <b-icon icon="filter" />
        </b-button>
      </b-navbar-brand>
    </b-navbar>
    <div class="map-container">
      <!-- map panel, controls -->

      <div class="map-panel card-body">
        <div class="accordion" role="tablist">
          <b-card no-body class="mb-1">
            <b-card-header header-tag="header" class="p-0" role="tab">
              <b-button v-b-toggle.controllers block variant="info" class="m-0">
                Controles
              </b-button>
            </b-card-header>
            <b-collapse
              id="controllers"
              visible
              accordion="my-accordion"
              role="tabpanel"
            >
              <b-card-body class="ml-3">
                <b-card-text>
                  <div class="form-check">
                    <input
                      v-model="incidence"
                      type="radio"
                      name="incidence"
                      checked="checked"
                      class="form-check-input"
                      :value="false"
                    />
                    <label class="form-check-label" for="exampleRadios1">
                      Ocorrência
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      v-model="incidence"
                      type="radio"
                      name="incidence"
                      checked="checked"
                      class="form-check-input"
                      :value="true"
                    />
                    <label class="form-check-label" for="exampleRadios2">
                      Incidência
                    </label>
                  </div>
                </b-card-text>
              </b-card-body>
            </b-collapse>
          </b-card>
        </div>
      </div>
      <!--// map panel, controls -->
      <client-only>
        <Map
          :map-features.sync="mapFeatures"
          :occurrences.sync="occurrences"
          :incidence.sync="incidence"
          :zoom="12"
        />
      </client-only>
    </div>
  </div>
</template>

<script>
import filters from '@/mixins/filters';
import pageMap from '@/mixins/page_map';

export default {
  name: 'PainelSimMaps',
  mixins: [filters, pageMap],
  data() {
    return {
      id: null,
      activeMap: false,
      mapFeatures: [],
      loadMap: true,
      featureType: 'neighborhood',
      initial: 'the',
      name: 'Piauí',
      locationName: 'Piauí',
      dataset: null,
      module: 'sim',
      isResident: true,
      incidence: false,
      residentOptions: [
        { text: 'Residente', value: true },
        { text: 'Total', value: false },
      ],
      loading: false,
      scopeLocation: 'ibge_id',
      urlBaseSerie: `dataset/serie/datasus/sim/`,
      urlBaseSerieRange: `dataset/serie/range/datasus/sim/`,
      urlSerie: '',
      urlSerieRange: '',
      occurrences: [],
      paramsByLocation: {
        per: 'codbaires',
        operation: 'count',
        page: '1',
        rating: 'numerodo',
        by_location_type: 'neighborhood',
      },
    };
  },

  async fetch() {
    const response = await this.$axios.get(`dataset/${this.$route.params.id}`);

    this.urlSerie = `${this.urlBaseSerie}${response.data.initial}`;
    this.urlSerieRange = `${this.urlBaseSerieRange}${response.data.initial}`;
    this.initial = response.data.initial;

    this.dataset = response.data;
    this.activeMap = false;
    await this.getFeatures(response.data, this.featureType);
    this.paramsByLocation = this.setFilters(this.paramsByLocation);
    await this.getOccurrences(response.data);
    this.activeMap = true;
    this.loadMap = false;
  },
  computed: {},
  watch: {
    mapFeatures() {},
    async featureType(val) {
      this.loadMap = true;
      // this.activeMap = false;
      await this.getFeatures(this.dataset, this.featureType);
      this.paramsByLocation.by_location_type = this.featureType;
      this.paramsByLocation = this.setFilters(this.paramsByLocation);
      await this.getOccurrences(this.dataset);
      // this.activeMap = true;
      this.loadMap = false;
    },
    async paramsByLocation(val) {
      this.loadMap = true;
      // this.activeMap = false;
      this.paramsByLocation.by_location_type = this.featureType;
      await this.getOccurrences(this.dataset);
      // this.activeMap = true;
      this.loadMap = false;
    },
  },
  created() {
    this.id = this.$route.params.id;
  },
  beforeMount() {},
  mounted() {},
  activated() {},
  updated() {},
  methods: {
    setFilters(params) {
      params = this.setFiltersCids(params, this.module, 'causabas');

      return { ...params };
    },
    changeScopeLocation(per) {
      /*
      this.loadMap = true;
      this.scopeLocation = per;
      this.paramsByLocation.per = per;
      this.paramsByLocation = this.setFilters(this.paramsByLocation);
      this.getOccurrences(this.dataset);
      this.loadMap = false;
       */
    },
    setAllFilters() {
      this.paramsByLocation = { ...this.setFilters(this.paramsByLocation) };
    },
  },
};
</script>
<style lang="postcss" scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.map-panel {
  position: absolute;
  top: 10px;
  right: 40px;
  max-height: 500px;
  width: 22em;
  z-index: 1000;
}
</style>

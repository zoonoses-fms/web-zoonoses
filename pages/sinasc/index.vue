<template>
  <div class="container-fluid ml-0 mr-0 pl-0 pr-0">
    <b-navbar toggleable="md" type="dark" variant="dark">
      <b-navbar-nav type="dark" variant="dark">
        <b-form-radio-group
          v-model="isResident"
          :options="residentOptions"
          name="radio-inline"
          button-variant="outline-danger btn-sm"
          buttons
        ></b-form-radio-group>
      </b-navbar-nav>
    </b-navbar>
    <div class="row">
      <div class="col-lg-4 col-md-6 col-sm-12 card-dashboard">
        <CardsDatasets
          ref="cardDatasets"
          :title.sync="locationName"
          :url.sync="url"
          sort="year"
          system="sinasc"
          :params.sync="paramsDatasets"
          @checked="changeDatasets"
        ></CardsDatasets>
      </div>
      <div class="col-lg-4 col-md-6 col-sm-12 card-dashboard">
        <client-only>
          <BarChartDataset
            title="Total de nascimentos: "
            :datasets.sync="checkedDatasets"
            :location-name.sync="locationName"
          ></BarChartDataset>
        </client-only>
      </div>
      <div class="col-lg-4 col-md-6 col-sm-12 card-dashboard">
        <client-only>
          <BarChartGrouped
            ref="serieByGrouped"
            title="Nascimentos por sexo: "
            :datasets.sync="checkedDatasets"
            :location-name.sync="locationName"
            :params.sync="paramsSerieBySexo"
            :url.sync="urlSerieRange"
          ></BarChartGrouped>
        </client-only>
      </div>
      <div class="col-12">
        <client-only>
          <LineChart
            ref="serieByMonth"
            title="Nascimentos por mês: "
            :datasets.sync="checkedDatasets"
            :location-name.sync="locationName"
            :params.sync="paramsSerieByMonth"
            :url.sync="urlSerie"
          ></LineChart>
        </client-only>
      </div>
    </div>
  </div>
</template>
<script>
import filters from '@/mixins/filters';
export default {
  name: 'PainelSinasc',
  mixins: [filters],
  data() {
    return {
      initial: 'the',
      name: 'Teresina',
      locationName: 'Teresina',
      scopeLocation: '',
      module: 'sinasc',
      isResident: true,
      residentOptions: [
        { text: 'Residente', value: true },
        { text: 'Total', value: false },
      ],
      loading: false,
      urlBase: `dataset/datasus/sinasc/`,
      urlBaseYear: `dataset/year/datasus/sinasc/`,
      urlBaseSerie: `dataset/serie/datasus/sinasc/`,
      urlBaseSerieRange: `dataset/serie/range/datasus/sinasc/`,
      url: '',
      urlSerie: '',
      urlSerieRange: '',
      checkedDatasets: [],
      paramsDatasets: {
        limit: 20,
      },
      paramsSerieByMonth: {
        per: 'dtnasc',
        rating: 'dtnasc',
        operation: 'count',
        per_page: 12,
        page: 1,
      },
      paramsSerieBySexo: {
        per: 'sexo',
        operation: 'count',
        ranger: 'sexo',
        per_page: 12,
        page: 1,
      },
    };
  },
  computed: {},
  watch: {
    isResident(val) {
      this.$store.commit(`${this.module}/setResident`, {
        isResident: val,
      });
      this.setAllFilters();
    },
    checkedDatasets(val) {
      // this.changeDatasets(val);
    },
  },
  created() {
    this.welcomeMessage();
    this.url = `${this.urlBase}${this.initial}`;
    this.urlSerie = `${this.urlBaseSerie}${this.initial}`;
    this.urlSerieRange = `${this.urlBaseSerieRange}${this.initial}`;
    this.urlBaseYear = `${this.urlBaseYear}${this.initial}`;

    this.setAllFilters();
  },
  beforeMount() {},
  mounted() {
    this.isResident = true;
    this.$nextTick(() => {});
  },
  activated() {},
  updated() {},
  methods: {
    welcomeMessage() {
      this.$store.commit('layout/CHANGE_NAV_TITLE', 'Tabulações do SINASC');
    },
    changeLocationState(initial) {
      this.$store.commit(`${this.module}/setInitial`, {
        initial,
      });
      this.url = `${this.urlBase}${initial}`;
      this.urlSerie = `${this.urlBaseSerie}${initial}`;
      this.urlSerieRange = `${this.urlBaseSerieRange}${initial}`;
      this.urlBaseYear = `${this.urlBaseYear}${this.initial}`;

      this.locations.every((location) => {
        if (location.initial === initial) {
          this.initial = location.initial;
          this.name = location.name;
          this.locationName = location.name;

          return false;
        }
        return true;
      });
      this.resetFilters('codmunres');
      this.setAllFilters();
    },
    changeDatasets(checkedDatasets) {
      this.checkedDatasets = checkedDatasets;
    },
    setFilters(params) {
      params = this.setFiltersLocation(params, this.module);
      params = this.setFiltersCids(params, this.module, 'causabas');

      return { ...params };
    },
    setAllFilters() {
      this.paramsDatasets = { ...this.setFilters(this.paramsDatasets) };
      this.paramsSerieByMonth = this.setFilters(this.paramsSerieByMonth);
      this.paramsSerieBySexo = this.setFilters(this.paramsSerieBySexo);
    },
  },
};
</script>
<style scoped>
.b-sidebar {
  width: 100%;
}
</style>

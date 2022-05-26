<template>
  <div class="container-fluid ml-0 mr-0 pl-0 pr-0">
    <b-sidebar id="filters" title="Filtros" width="368px" right shadow>
      <div class="px-3 py-2">
        <CardsCids
          :loading.sync="loading"
          store="sim"
          @update="setAllFilters"
        ></CardsCids>
      </div>
    </b-sidebar>
    <b-navbar toggleable="md" type="dark" variant="dark" class="px-2 py-0">
      <b-navbar-brand>
        <b-button v-b-toggle.filters size="sm">
          <b-icon icon="filter" />
        </b-button>
      </b-navbar-brand>

      <b-navbar-brand type="dark" variant="dark">
        <b-form-radio-group
          v-model="isResident"
          :options="residentOptions"
          name="radio-inline"
          button-variant="outline-danger btn-sm"
          buttons
        ></b-form-radio-group>
      </b-navbar-brand>
    </b-navbar>
    <div class="row">
      <div class="col-lg-4 col-md-6 col-sm-12 card-dashboard">
        <CardsDatasets
          ref="cardDatasets"
          :title.sync="locationName"
          :url.sync="url"
          sort="year"
          system="sim"
          :params.sync="paramsDatasets"
          @checked="changeDatasets"
        ></CardsDatasets>
      </div>
      <div class="col-lg-4 col-md-6 col-sm-12 card-dashboard">
        <client-only>
          <BarChartDataset
            title="Total de óbitos: "
            :datasets.sync="checkedDatasets"
            :location-name.sync="locationName"
          ></BarChartDataset>
        </client-only>
      </div>
      <div class="col-lg-4 col-md-6 col-sm-12 card-dashboard">
        <client-only>
          <BarChartGrouped
            ref="serieByGrouped"
            title="Óbitos por sexo: "
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
            title="Óbitos por mês: "
            :datasets.sync="checkedDatasets"
            :location-name.sync="locationName"
            :params.sync="paramsSerieByMonth"
            :url.sync="urlSerie"
          ></LineChart>
        </client-only>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 col-sm-12 card-dashboard">
        <client-only>
          <BarChartDataset
            title="Total de óbitos causas externas: "
            :datasets.sync="checkedDatasetExts"
            :location-name.sync="locationName"
          ></BarChartDataset>
        </client-only>
      </div>
      <div class="col-md-6 col-sm-12 card-dashboard">
        <client-only>
          <BarChartGrouped
            ref="serieByGroupedExt"
            title="Óbitos causas externas por sexo: "
            :datasets.sync="checkedDatasetExts"
            :location-name.sync="locationName"
            :params.sync="paramsSerieBySexoExt"
            :url.sync="urlSerieRange"
          ></BarChartGrouped>
        </client-only>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <client-only>
          <LineChart
            ref="serieByMonthExt"
            title="Óbitos causas externas por mês: "
            :datasets.sync="checkedDatasetExts"
            :location-name.sync="locationName"
            :params.sync="paramsSerieByMonthExt"
            :url.sync="urlSerie"
          ></LineChart>
        </client-only>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 col-sm-12 card-dashboard">
        <client-only>
          <BarChartDataset
            title="Total de óbitos fetais: "
            :datasets.sync="checkedDatasetFets"
            :location-name.sync="locationName"
          ></BarChartDataset>
        </client-only>
      </div>
      <div class="col-md-6 col-sm-12 card-dashboard">
        <client-only>
          <BarChartGrouped
            ref="serieByGroupedFet"
            title="Óbitos fetais por sexo: "
            :datasets.sync="checkedDatasetFets"
            :location-name.sync="locationName"
            :params.sync="paramsSerieBySexoFet"
            :url.sync="urlSerieRange"
          ></BarChartGrouped>
        </client-only>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <client-only>
          <LineChart
            ref="serieByMonthFet"
            title="Óbitos fetais por mês: "
            :datasets.sync="checkedDatasetFets"
            :location-name.sync="locationName"
            :params.sync="paramsSerieByMonthFet"
            :url.sync="urlSerie"
          ></LineChart>
        </client-only>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 col-sm-12 card-dashboard">
        <client-only>
          <BarChartDataset
            title="Total de óbitos infantil: "
            :datasets.sync="checkedDatasetInfs"
            :location-name.sync="locationName"
          ></BarChartDataset>
        </client-only>
      </div>
      <div class="col-md-6 col-sm-12 card-dashboard">
        <client-only>
          <BarChartGrouped
            ref="serieByGroupedFet"
            title="Óbitos infantil por sexo: "
            :datasets.sync="checkedDatasetInfs"
            :location-name.sync="locationName"
            :params.sync="paramsSerieBySexoInf"
            :url.sync="urlSerieRange"
          ></BarChartGrouped>
        </client-only>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <client-only>
          <LineChart
            ref="serieByMonthFet"
            title="Óbitos infantil por mês: "
            :datasets.sync="checkedDatasetInfs"
            :location-name.sync="locationName"
            :params.sync="paramsSerieByMonthInf"
            :url.sync="urlSerie"
          ></LineChart>
        </client-only>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 col-sm-12 card-dashboard">
        <client-only>
          <BarChartDataset
            title="Total de óbitos maternos: "
            :datasets.sync="checkedDatasetMats"
            :location-name.sync="locationName"
          ></BarChartDataset>
        </client-only>
      </div>
      <div class="col-md-6 col-sm-12 card-dashboard">
        <client-only>
          <BarChartGrouped
            ref="serieByGroupedFet"
            title="Óbitos maternos por sexo: "
            :datasets.sync="checkedDatasetMats"
            :location-name.sync="locationName"
            :params.sync="paramsSerieBySexoMat"
            :url.sync="urlSerieRange"
          ></BarChartGrouped>
        </client-only>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <client-only>
          <LineChart
            ref="serieByMonthFet"
            title="Óbitos maternos por mês: "
            :datasets.sync="checkedDatasetMats"
            :location-name.sync="locationName"
            :params.sync="paramsSerieByMonthMat"
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
  name: 'PainelSim',
  mixins: [filters],
  data() {
    return {
      initial: 'the',
      name: 'Teresina',
      locationName: 'Teresina',
      scopeLocation: '',
      module: 'sim',
      isResident: true,
      residentOptions: [
        { text: 'Residente', value: true },
        { text: 'Total', value: false },
      ],
      loading: false,
      urlBase: `dataset/datasus/sim/`,
      urlBaseYear: `dataset/year/datasus/sim/`,
      urlBaseSerie: `dataset/serie/datasus/sim/`,
      urlBaseSerieRange: `dataset/serie/range/datasus/sim/`,
      url: '',
      urlSerie: '',
      urlSerieRange: '',
      checkedDatasets: [],
      checkedDatasetExts: [],
      checkedDatasetFets: [],
      checkedDatasetInfs: [],
      checkedDatasetMats: [],
      paramsDatasets: {
        limit: 20,
      },
      paramsDatasetsExt: {
        limit: 20,
        column_is_not_null: 'circobito',
      },
      paramsDatasetsFet: {
        limit: 20,
        column_filter: ['tipobito'],
        term_filter: ['1'],
      },
      paramsDatasetsInf: {
        limit: 20,
        column_filter_between: 'idade',
        terms_filter_between: [1, 400],
      },
      paramsDatasetsMat: {
        limit: 20,
        column_filter_or: ['obitograv', 'obitopuerp', 'obitopuerp'],
        term_filter_or: ['1', '1', '2'],
      },
      paramsSerieByMonth: {
        per: 'dtobito',
        rating: 'dtobito',
        operation: 'count',
        per_page: 12,
        page: 1,
      },
      paramsSerieByMonthExt: {
        per: 'dtobito',
        rating: 'dtobito',
        operation: 'count',
        column_is_not_null: 'circobito',
        per_page: 12,
        page: 1,
      },
      paramsSerieByMonthFet: {
        per: 'dtobito',
        rating: 'dtobito',
        operation: 'count',
        column_filter: ['tipobito'],
        term_filter: ['1'],
        per_page: 12,
        page: 1,
      },
      paramsSerieByMonthInf: {
        per: 'dtobito',
        rating: 'dtobito',
        operation: 'count',
        column_filter_between: 'idade',
        terms_filter_between: [1, 400],
        per_page: 12,
        page: 1,
      },
      paramsSerieByMonthMat: {
        per: 'dtobito',
        rating: 'dtobito',
        operation: 'count',
        column_filter_or: ['obitograv', 'obitopuerp', 'obitopuerp'],
        term_filter_or: ['1', '1', '2'],
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
      paramsSerieBySexoExt: {
        per: 'sexo',
        operation: 'count',
        ranger: 'sexo',
        column_is_not_null: 'circobito',
        per_page: 12,
        page: 1,
      },
      paramsSerieBySexoFet: {
        per: 'sexo',
        operation: 'count',
        ranger: 'sexo',
        column_filter: ['tipobito'],
        term_filter: ['1'],
        per_page: 12,
        page: 1,
      },
      paramsSerieBySexoInf: {
        per: 'sexo',
        operation: 'count',
        ranger: 'sexo',
        column_filter_between: 'idade',
        terms_filter_between: [1, 400],
        per_page: 12,
        page: 1,
      },
      paramsSerieBySexoMat: {
        per: 'sexo',
        operation: 'count',
        ranger: 'sexo',
        column_filter_or: ['obitograv', 'obitopuerp', 'obitopuerp'],
        term_filter_or: ['1', '1', '2'],
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
      this.$store.commit('layout/CHANGE_NAV_TITLE', 'Tabulações do SIM');
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
    async changeDatasets(checkedDatasets) {
      this.checkedDatasets = checkedDatasets;

      const dataSetExts = [];
      const dataSetFets = [];
      const dataSetInfs = [];
      const dataSetMats = [];

      for (const checkedDataset of this.checkedDatasets) {
        const responseExt = await this.$axios.get(
          `${this.urlBaseYear}/${checkedDataset.year}`,
          {
            params: this.paramsDatasetsExt,
          }
        );
        dataSetExts.push(responseExt.data);

        const responseFet = await this.$axios.get(
          `${this.urlBaseYear}/${checkedDataset.year}`,
          {
            params: this.paramsDatasetsFet,
          }
        );
        dataSetFets.push(responseFet.data);

        const responseInf = await this.$axios.get(
          `${this.urlBaseYear}/${checkedDataset.year}`,
          {
            params: this.paramsDatasetsInf,
          }
        );
        dataSetInfs.push(responseInf.data);

        const responseMat = await this.$axios.get(
          `${this.urlBaseYear}/${checkedDataset.year}`,
          {
            params: this.paramsDatasetsMat,
          }
        );
        dataSetMats.push(responseMat.data);
      }

      this.checkedDatasetExts = [...dataSetExts];
      this.checkedDatasetFets = [...dataSetFets];
      this.checkedDatasetInfs = [...dataSetInfs];
      this.checkedDatasetMats = [...dataSetMats];
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
      // externas
      this.paramsDatasetsExt = { ...this.setFilters(this.paramsDatasetsExt) };
      this.paramsSerieByMonthExt = this.setFilters(this.paramsSerieByMonthExt);
      this.paramsSerieBySexoExt = this.setFilters(this.paramsSerieBySexoExt);
      // fetais
      this.paramsDatasetsFet = { ...this.setFilters(this.paramsDatasetsFet) };
      this.paramsSerieByMonthFet = this.setFilters(this.paramsSerieByMonthFet);
      this.paramsSerieBySexoFet = this.setFilters(this.paramsSerieBySexoFet);
      // Infantis
      this.paramsDatasetsInf = { ...this.setFilters(this.paramsDatasetsInf) };
      this.paramsSerieByMonthInf = this.setFilters(this.paramsSerieByMonthInf);
      this.paramsSerieBySexoInf = this.setFilters(this.paramsSerieBySexoInf);
      // Maternos
      this.paramsDatasetsMat = { ...this.setFilters(this.paramsDatasetsMat) };
      this.paramsSerieByMonthMat = this.setFilters(this.paramsSerieByMonthMat);
      this.paramsSerieBySexoMat = this.setFilters(this.paramsSerieBySexoMat);
    },
  },
};
</script>
<style scoped>
.b-sidebar {
  width: 100%;
}
</style>

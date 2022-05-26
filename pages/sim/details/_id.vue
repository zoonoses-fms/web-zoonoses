<template>
  <div class="container-fluid ml-0 mr-0 pl-0 pr-0">
    <div class="row">
      <div class="col-md-6 col-sm-12 card-dashboard">
        <client-only>
          <BarChartPaginate
            title="Óbitos por unidade"
            :dataset.sync="dataset"
            :location-name.sync="locationName"
            :params.sync="paramsHealthUnits"
            :url.sync="urlSerie"
          ></BarChartPaginate>
        </client-only>
      </div>
      <div class="col-md-6 col-sm-12 card-dashboard">
        <client-only>
          <BarChartAgePyramid
            title="Pirâmide etária"
            :dataset.sync="dataset"
            :location-name.sync="locationName"
            :params.sync="paramsSerieByIdade"
            :url.sync="urlSerieRange"
            :code-sex="codeSex"
          ></BarChartAgePyramid>
        </client-only>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 col-sm-12 card-dashboard">
        <client-only>
          <BarChartPaginate
            title="Óbitos por causa base"
            :dataset.sync="dataset"
            :location-name.sync="locationName"
            :params.sync="paramsSerieByCid"
            :url.sync="urlSerie"
            @change="changeCids"
          ></BarChartPaginate>
        </client-only>
      </div>
      <div class="col-md-6 col-sm-12 card-dashboard">
        <client-only>
          <LineChartGrouped
            title="Óbitos por causa base"
            :dataset.sync="dataset"
            :location-name.sync="locationName"
            :params.sync="paramsSerieByCidGrouped"
            :url.sync="urlSerie"
            :grouped="groupedCids"
          ></LineChartGrouped>
        </client-only>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 col-sm-12 card-dashboard">
        <client-only>
          <BarChartAgePyramid
            title="Pirâmide etária infantil"
            :dataset.sync="dataset"
            :location-name.sync="locationName"
            :params.sync="paramsSerieByIdadInfantil"
            :url.sync="urlSerieRange"
            :code-sex="codeSex"
          ></BarChartAgePyramid>
        </client-only>
      </div>
      <div class="col-md-6 col-sm-12 card-dashboard">
        <client-only>
          <DonutChartRanger
            title="Por estado civil"
            :dataset.sync="dataset"
            :location-name.sync="locationName"
            :params.sync="paramsSerieByCivil"
            :url.sync="urlSerieRange"
            palette="pastels"
          ></DonutChartRanger>
        </client-only>
      </div>
    </div>
  </div>
</template>
<script>
import filters from '@/mixins/filters';
export default {
  name: 'PainelSimDeails',
  mixins: [filters],
  data() {
    return {
      id: null,
      initial: 'the',
      name: 'Teresina',
      locationName: 'Teresina',
      codeSex: { male: 'M', female: 'F' },
      dataset: null,
      module: 'sim',
      isResident: true,
      residentOptions: [
        { text: 'Residente', value: true },
        { text: 'Total', value: false },
      ],
      urlBaseSerie: `dataset/serie/datasus/sim/`,
      urlBaseSerieRange: `dataset/serie/range/datasus/sim/`,
      urlSerie: '',
      urlSerieRange: '',
      groupedCids: [],
      groupedCidsDnc: [],
      paramsHealthUnits: {
        per: 'codestab',
        rating: 'numerodo',
        operation: 'count',
      },
      paramsSerieByIdade: {
        per: 'idade',
        rating: 'numerodo',
        ranger: 'faixa_etaria_pd',
        per_page: 10,
        page: 1,
      },
      paramsSerieByIdadInfantil: {
        per: 'idade',
        rating: 'numerodo',
        ranger: 'faixa_etaria_inf1',
        per_page: 10,
        page: 1,
      },
      paramsSerieByCid: {
        per: 'causabas',
        rating: 'numerodo',
        operation: 'count',
        per_page: 6,
      },
      paramsSerieByCidGrouped: {
        per: 'dtobito',
        rating: 'causabas',
        operation: 'count',
        column_filter: ['causabas'],
      },
      paramsSerieByCidDnc: {
        per: 'causabas',
        rating: 'numerodo',
        operation: 'count',
        dnc: true,
        per_page: 6,
      },
      paramsSerieByCidDncGrouped: {
        per: 'dtobito',
        rating: 'causabas',
        operation: 'count',
        column_filter: ['causabas'],
      },
      paramsSerieByCivil: {
        per: 'estciv',
        operation: 'count',
        ranger: 'estado_civil',
        column_filter: ['idade', 'estciv'],
        term_filter: ['418', '9'],
        operator_filter: ['>=', '!='],
      },
    };
  },
  async fetch() {
    const response = await this.$axios.get(`dataset/${this.$route.params.id}`);

    this.urlSerie = `${this.urlBaseSerie}${response.data.initial}`;
    this.urlSerieRange = `${this.urlBaseSerieRange}${response.data.initial}`;
    this.initial = response.data.initial;

    this.dataset = response.data;

    this.setAllFilters();
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
    this.id = this.$route.params.id;
  },
  beforeMount() {},
  mounted() {
    this.$nextTick(() => {});
  },
  activated() {},
  updated() {},
  methods: {
    setFilters(params) {
      params = this.setFiltersLocation(params, this.module);
      params = this.setFiltersCids(params, this.module, 'causabas');

      return { ...params };
    },
    changeCids(data) {
      this.groupedCids = [...data];
    },
    changeCidsDnc(data) {
      this.groupedCidsDnc = [...data];
    },
    setAllFilters() {
      this.paramsHealthUnits = this.setFilters(this.paramsHealthUnits);
      this.paramsSerieByIdade = this.setFilters(this.paramsSerieByIdade);
      this.paramsSerieByCid = this.setFilters(this.paramsSerieByCid);
      this.paramsSerieByCidDnc = this.setFilters(this.paramsSerieByCidDnc);
      this.paramsSerieByIdadInfantil = this.setFilters(
        this.paramsSerieByIdadInfantil
      );
      this.paramsSerieByCivil = this.setFilters(this.paramsSerieByCivil);
    },
  },
};
</script>

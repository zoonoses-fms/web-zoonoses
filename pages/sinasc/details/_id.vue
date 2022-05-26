<template>
  <div class="container-fluid ml-0 mr-0 pl-0 pr-0">
    <div class="row">
      <div class="col-md-6 col-sm-12 card-dashboard">
        <client-only>
          <BarChartPaginate
            title="Nascidos vivos por unidade "
            :dataset.sync="dataset"
            :location-name.sync="locationName"
            :params.sync="paramsHealthUnits"
            :url.sync="urlSerie"
          ></BarChartPaginate>
        </client-only>
      </div>
      <div class="col-md-6 col-sm-12 card-dashboard">
        <client-only>
          <BarChartPaginate
            title="Nascidos vivos por CBO da mãe "
            :dataset.sync="dataset"
            :location-name.sync="locationName"
            :params.sync="paramsSerieCbo"
            :url.sync="urlSerie"
          ></BarChartPaginate>
        </client-only>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 col-sm-12 card-dashboard">
        <client-only>
          <BarChartRanger
            title="Idade da mãe"
            :dataset.sync="dataset"
            :location-name.sync="locationName"
            :params.sync="paramsSerieByIdademae"
            :url.sync="urlSerieRange"
            palette="metro"
          ></BarChartRanger>
        </client-only>
      </div>
      <div class="col-md-6 col-sm-12 card-dashboard">
        <client-only>
          <DonutChartRanger
            title="Tipo de gravidez"
            :dataset.sync="dataset"
            :location-name.sync="locationName"
            :params.sync="paramsSerieGravidez"
            :url.sync="urlSerieRange"
            palette="pastels"
          ></DonutChartRanger>
        </client-only>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 col-sm-12 card-dashboard">
        <client-only>
          <DonutChartRanger
            title="Tipo de parto"
            :dataset.sync="dataset"
            :location-name.sync="locationName"
            :params.sync="paramsSerieParto"
            :url.sync="urlSerieRange"
            palette="pastels"
          ></DonutChartRanger>
        </client-only>
      </div>
      <div class="col-md-6 col-sm-12 card-dashboard">
        <client-only>
          <DonutChartRanger
            title="Por peso do RN"
            :dataset.sync="dataset"
            :location-name.sync="locationName"
            :params.sync="paramsSeriePeso"
            :url.sync="urlSerieRange"
            palette="pastels"
          ></DonutChartRanger>
        </client-only>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6 col-sm-12 card-dashboard">
        <client-only>
          <DonutChartRanger
            title="Por estado civil da mãe"
            :dataset.sync="dataset"
            :location-name.sync="locationName"
            :params.sync="paramsSerieEstadoCivil"
            :url.sync="urlSerieRange"
            palette="pastels"
          ></DonutChartRanger>
        </client-only>
      </div>
      <div class="col-md-6 col-sm-12 card-dashboard">
        <client-only>
          <PolarChart
            title="Número de consultas pre-natal"
            :dataset.sync="dataset"
            :location-name.sync="locationName"
            :params.sync="paramsSerieConsultas"
            :url.sync="urlSerie"
            palette="pastels"
          ></PolarChart>
        </client-only>
      </div>
    </div>
  </div>
</template>
<script>
import filters from '@/mixins/filters';
export default {
  name: 'PainelSinascDeails',
  mixins: [filters],
  data() {
    return {
      id: null,
      initial: 'the',
      name: 'Teresina',
      locationName: 'Teresina',
      codeSex: { male: 'M', female: 'F' },
      dataset: null,
      module: 'sinasc',
      isResident: true,
      residentOptions: [
        { text: 'Residente', value: true },
        { text: 'Total', value: false },
      ],
      urlBaseSerie: `dataset/serie/datasus/sinasc/`,
      urlBaseSerieRange: `dataset/serie/range/datasus/sinasc/`,
      urlSerie: '',
      urlSerieRange: '',
      groupedCids: [],
      groupedCidsDnc: [],
      paramsHealthUnits: {
        per: 'codestab',
        rating: 'numerodn',
        operation: 'count',
      },
      paramsSerieByIdademae: {
        per: 'idademae',
        operation: 'count',
        ranger: 'idademae',
      },
      paramsSerieCbo: {
        per: 'codocupmae',
        rating: 'numerodn',
        operation: 'count',
      },
      paramsSerieGravidez: {
        per: 'gravidez',
        operation: 'count',
        ranger: 'tipo_gravidez',
      },
      paramsSerieParto: {
        per: 'parto',
        operation: 'count',
        ranger: 'tipo_parto',
      },
      paramsSeriePeso: {
        per: 'peso',
        operation: 'count',
        ranger: 'peso',
      },
      paramsSerieEstadoCivil: {
        per: 'estcivmae',
        operation: 'count',
        ranger: 'estado_civil',
      },
      paramsSerieConsultas: {
        per: 'consultas',
        operation: 'count',
        rating: 'numerodn',
        per_page: '15',
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
      return { ...params };
    },
    setAllFilters() {
      this.paramsHealthUnits = this.setFilters(this.paramsHealthUnits);
      this.paramsSerieByIdademae = this.setFilters(this.paramsSerieByIdademae);
      this.paramsSerieCbo = this.setFilters(this.paramsSerieCbo);
      this.paramsSerieGravidez = this.setFilters(this.paramsSerieGravidez);
      this.paramsSerieParto = this.setFilters(this.paramsSerieParto);
      this.paramsSeriePeso = this.setFilters(this.paramsSeriePeso);
      this.paramsSerieEstadoCivil = this.setFilters(
        this.paramsSerieEstadoCivil
      );
      this.paramsSerieConsultas = this.setFilters(this.paramsSerieConsultas);
    },
  },
};
</script>

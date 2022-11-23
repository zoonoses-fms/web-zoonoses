<template>
  <div class="card text-center shadow-2xl m-2">
    <div class="row">
      <div class="col-lg-4 col-md-6 col-sm-12 card-dashboard">
        <CardsDatasets
          ref="cardDatasets"
          :title.sync="locationName"
          :url.sync="url"
          sort="year"
          system="dengeon"
          :params.sync="paramsDatasets"
          @checked="changeDatasets"
        ></CardsDatasets>
      </div>
      <div class="col-lg-4 col-md-6 col-sm-12 card-dashboard">
        <client-only>
          <BarChartDataset
            title="Total de Notificações: "
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
    </div>
    <div class="row">
      <div class="col-12">
        <client-only>
          <LineChart
            ref="serieByMonth"
            title="Notificação por mês: "
            :datasets.sync="checkedDatasets"
            :location-name.sync="locationName"
            :params.sync="paramsSerieByMonth"
            :url.sync="urlSerie"
          ></LineChart>
        </client-only>
      </div>
    </div>
    <div class="row justify-content-md-center">
      <div class="col-11">
        <client-only>
          <LazyEchartsBar3DChart
            ref="serieByWeek"
            title="Notificação por semana: "
            :datasets.sync="checkedDatasets"
            :location-name.sync="locationName"
            :params.sync="paramsSerieByWeek"
            :url.sync="urlSerie"
          ></LazyEchartsBar3DChart>
        </client-only>
      </div>
    </div>
    {{ $route.params }}
  </div>
</template>

<script>
export default {
  name: 'DashboadShow',
  layout: 'simple',
  data() {
    return {
      initial: 'the',
      locationName: 'Teresina',
      checkedDatasets: [],
      urlBase: `dataset/datasus/dengueon/`,
      urlBaseSerieRange: `dataset/serie/range/datasus/dengueon/`,
      urlBaseSerie: `dataset/serie/datasus/dengueon/`,
      urlSerieRange: '',
      paramsDatasets: {
        limit: 20,
      },
      paramsSerieBySexo: {
        per: 'cs_sexo',
        operation: 'count',
        ranger: 'sexo',
        per_page: 12,
        page: 1,
      },
      paramsSerieByMonth: {
        per: 'dt_notific',
        rating: 'dt_notific',
        operation: 'count',
        per_page: 12,
        page: 1,
      },
      paramsSerieByWeek: {
        per: 'sem_not',
        rating: 'id',
        operation: 'count',
        per_page: 60,
        page: 1,
      },
    };
  },
  created() {
    this.url = `${this.urlBase}${this.initial}`;
    this.urlSerieRange = `${this.urlBaseSerieRange}${this.initial}`;
    this.urlSerie = `${this.urlBaseSerie}${this.initial}`;
  },
  methods: {
    changeDatasets(checkedDatasets) {
      this.checkedDatasets = checkedDatasets;
    },
  },
};
</script>

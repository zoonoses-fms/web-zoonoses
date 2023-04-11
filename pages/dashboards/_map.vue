<template>
  <div class="card text-center shadow m-2">
    <div class="row">
      <div class="col-12 col-md-6 col-lg-4">
        <div class="row">
          <div class="col-12">
            <NuxtLink
              :to="`/dashboards/data/datasus/${$route.params.system}/${initial}`"
              class="btn btn-sm btn-block btn-info d-flex justify-content-between"
            >
              <BIconBarChart />Estatísticas
              <BIconArrowReturnRight />
            </NuxtLink>

            <client-only>
              <LazyCardsDatasets
                ref="cardDatasets"
                :title.sync="locationName"
                :url.sync="url"
                sort="year"
                system="dengeon"
                :params.sync="paramsDatasets"
                @checked="changeDatasets"
              ></LazyCardsDatasets>
            </client-only>
          </div>
          <div class="col-12">
            <client-only>
              <LazyBarChartDataset
                title="Total de Notificações: "
                :datasets.sync="checkedDatasets"
                :location-name.sync="locationName"
              ></LazyBarChartDataset>
            </client-only>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 col-lg-8 map-points">
        <client-only placeholder="Loading...">
          <LazyOlMapViewClusters
            height="80"
            :datasets.sync="checkedDatasets"
            :zoom-out="14"
          >
          </LazyOlMapViewClusters>
        </client-only>
      </div>
    </div>
  </div>
</template>

<script>
import geocode from '@/mixins/geocode';
export default {
  name: 'PageMapsSupport',
  mixins: [geocode],
  layout: 'simple',
  data() {
    return {
      initial: 'the',
      locationName: 'Teresina',
      checkedDatasets: [],
      urlBase: `dataset/datasus/`,
      paramsDatasets: {
        limit: 20,
      },
      url: null,
    };
  },
  created() {
    this.url = `${this.urlBase}${this.$route.params.system}/${this.initial}`;
    this.welcomeMessage();
  },
  methods: {
    welcomeMessage() {
      this.$store.commit('layout/CHANGE_NAV_TITLE', 'Mapa casos Aboviroses');
    },

    changeDatasets(checkedDatasets) {
      this.checkedDatasets = checkedDatasets;
    },
  },
};
</script>
<style scoped>
.map-points {
  width: 100%;
  height: 80vh;
}
</style>

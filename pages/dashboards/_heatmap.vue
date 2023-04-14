<template>
  <div class="card text-center shadow m-2">
    <div class="row">
      <div class="col-12 col-md-6 col-lg-4 table-cases">
        <LazyTablesCases
          :id="id"
          :url.sync="urlSerie"
          :params="paramsSerieByCases"
        />
      </div>
      <div class="col-12 col-md-6 col-lg-8 map-points">
        <client-only placeholder="Loading...">
          <LazyOlMapViewHeatmaps
            height="80"
            :map-features.sync="mapFeatures"
            :zoom-out="14"
          >
          </LazyOlMapViewHeatmaps>
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
  auth: false,
  // dataset/serie/{source}/{system}/{initial}/{id}
  data() {
    return {
      locationName: 'Teresina',
      urlGeocodes: 'dataset/geocodes/',
      urlBase: `dataset/`,
      urlBaseSerie: `dataset/serie/`,
      url: '',
      urlSerie: '',
      paramsDatasets: {
        limit: 20,
      },
      mapFeatures: [],
      paramsSerieByCases: {
        per: 'nm_bairro',
        rating: 'nm_bairro',
        operation: 'count',
        order_by: 'desc',
        per_page: 200,
        page: 1,
      },
      source: '',
      system: '',
      initial: '',
      id: '',
    };
  },
  created() {
    this.source = this.$route.params.source;
    this.system = this.$route.params.system;
    this.initial = this.$route.params.initial;
    this.id = this.$route.params.id;
    this.url = `${this.urlBase}${this.source}/${this.system}/${this.initial}${this.initial}`;
    this.urlSerie = `${this.urlBaseSerie}${this.source}/${this.system}/${this.initial}`;
    this.welcomeMessage();
    this.getRegisters(this.id);
  },
  methods: {
    welcomeMessage() {
      this.$store.commit('layout/CHANGE_NAV_TITLE', 'Mapa casos arboviroses');
    },

    async getRegisters(id) {
      const response = await this.$axios.get(`${this.urlGeocodes}${id}`);

      const registers = response.data;
      const geocodes = [];
      registers.splice(0, 1);
      for (const [index, item] of registers.entries()) {
        if (item.geometry != null) {
          geocodes.push({
            type: 'Feature',
            id: index,
            geometry: JSON.parse(item.geometry),
            properties: {
              source_id: id,
              count: item.count,
            },
          });
        }
      }
      this.mapFeatures = await geocodes;
    },
  },
};
</script>
<style scoped>
.map-points {
  width: 100%;
  height: 80vh;
}

.table-cases {
  height: 80vh;
  overflow-y: auto;
}
</style>

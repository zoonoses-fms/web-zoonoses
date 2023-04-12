<template>
  <div class="card text-center shadow m-2">
    <div class="row">
      <div class="col-12 map-points">
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
  data() {
    return {
      initial: 'the',
      locationName: 'Teresina',
      // urlBase: `dataset/datasus/dengueon/`,
      urlGeocodes: 'dataset/geocodes/',
      paramsDatasets: {
        limit: 20,
      },
      url: null,
      mapFeatures: []
    };
  },
  created() {
    this.id = this.$route.params.id;
    // this.url = `${this.urlBase}${this.initial}`;
    this.welcomeMessage();
    this.getRegisters(this.id);

  },
  methods: {
    welcomeMessage() {
      this.$store.commit('layout/CHANGE_NAV_TITLE', 'Mapa casos arboviroses');
    },

    async getRegisters(id) {
      const response = await this.$axios.get(
        `${this.urlGeocodes}${id}`
      );

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
</style>

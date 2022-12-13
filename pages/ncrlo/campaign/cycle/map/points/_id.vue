<template>
  <div class="map-points col-12">
    <client-only placeholder="Loading...">
      <LazyOlMapViewLegendPoints
        height="80"
        :map-features.sync="supports"
        :zoom-out="14"
        color-radar="#198754"
        color-default="#28a745"
      >
      </LazyOlMapViewLegendPoints>
    </client-only>
  </div>
</template>

<script>
import geocode from '@/mixins/geocode';
export default {
  name: 'PageMapsPoint',
  mixins: [geocode],
  data() {
    return {
      id: null,
      supports: [],
      url: 'ncrlo/campaign/cycle/',
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.getPoints();
    this.welcomeMessage();
  },
  methods: {
    welcomeMessage() {
      this.$store.commit('layout/CHANGE_NAV_TITLE', 'Mapa de Pontos de Apoio');
    },
    async getPoints() {
      const params = {
        map: 'point',
      };

      const response = await this.$axios.get(`${this.url}${this.id}`, {
        params,
      });

      const cycle = response.data;
      console.log(cycle);
      const supports = [];
      for (const itemSupport of cycle.supports) {
        if (itemSupport.support.geometry != null) {
          supports.push(this.generateGeoJson(itemSupport.support));
          const index = supports.length - 1;
          supports[index].properties.points = [];
          for (const item of itemSupport.points) {
            if (item.point.geometry != null) {
              supports[index].properties.points.push(
                this.generateGeoJson(item.point)
              );
            }
          }
        }
      }

      this.supports = [...supports];
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

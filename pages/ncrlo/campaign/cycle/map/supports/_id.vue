<template>
  <div class="map-points col-12">
    <client-only placeholder="Loading...">
      <OlMapViewLegendPoints
        height="80"
        :map-features.sync="supports"
        :zoom-out="14"
        color-radar="#0d6efd"
        color-default="#17a2b8"
      >
      </OlMapViewLegendPoints>
    </client-only>
  </div>
</template>

<script>
import geocode from '@/mixins/geocode';
export default {
  name: 'PageMapsSupport',
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
    this.getSupports();
    this.welcomeMessage();
  },
  methods: {
    welcomeMessage() {
      this.$store.commit('layout/CHANGE_NAV_TITLE', 'Mapa de Pontos de Apoio');
    },
    async getSupports() {
      const params = {
        map: 'support',
      };

      const response = await this.$axios.get(`${this.url}${this.id}`, {
        params,
      });
      const supports = [];
      const cycle = response.data;
      for (const item of cycle.supports) {
        if (item.support.geometry != null) {
          supports.push(this.generateGeoJson(item.support));
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

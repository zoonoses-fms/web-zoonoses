<template>
  <div class="map-points col-12">
    <client-only placeholder="Loading...">
      <OlMapViewPoints
        height="80"
        :map-features.sync="points"
        :zoom-out="16"
        color-radar="#198754"
        color-default="#28a745"
      >
      </OlMapViewPoints>
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
      points: [],
      url: 'ncrlo/campaign/',
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

      const campaign = response.data;

      for (const cycle of campaign.cycles) {
        for (const support of cycle.supports) {
          for (const item of support.points) {
            if (item.point.geometry != null) {
              this.points.push(this.generateGeoJson(item.point));
            }
          }
        }
      }
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

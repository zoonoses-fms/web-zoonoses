<template>
  <div class="map-points col-12">
    <client-only placeholder="Loading...">
      <OlMapViewPublic
        height="90"
        :map-features.sync="supports"
        :zoom-out="2"
        color-radar="#198754"
        color-default="#28a745"
      >
      </OlMapViewPublic>
    </client-only>
  </div>
</template>

<script>
import moment from 'moment';
import geocode from '@/mixins/geocode';

export default {
  name: 'PageMapsPublicPoint',
  auth: false,
  mixins: [geocode],
  layout: 'simple',
  data() {
    return {
      id: null,
      supports: [],
      url: 'ncrlo/campaign/cycle/public/map/',
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.getPoints();
    this.welcomeMessage();
  },
  methods: {
    welcomeMessage() {
      this.$store.commit('layout/CHANGE_NAV_TITLE', 'Posto de Vacina');
    },
    async getPoints() {

      const response = await this.$axios.get(`${this.url}${this.id}`);

      const cycle = response.data;
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
      this.$store.commit('layout/CHANGE_NAV_TITLE', `Posto de Vacina ${cycle.description} ${moment(String(cycle.start)).format('DD/MM/YYYY')}`);
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

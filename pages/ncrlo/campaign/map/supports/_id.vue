<template>
  <div class="map-points col-12">
    <client-only placeholder="Loading...">
      <OlMapPoints height="80" :map-features.sync="supports" :zoom-out="16" color-radar="#17a2b8" color-default="#17a2b8">
      </OlMapPoints>
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
      url: 'ncrlo/campaign/',
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.getSupports();
    this.welcomeMessage();
  },
  methods: {
    welcomeMessage() {
      this.$store.commit('layout/CHANGE_NAV_TITLE', 'Mapa de Pontos de Apoios');
    },
    async getSupports() {
      const params = {
        map: 'support'
      };

      const response = await this.$axios.get(`${this.url}${this.id}`, {
        params
      });

      const campaign = response.data;

      for (const item of campaign.supports) {
        if (item.support.geometry != null) {
          this.supports.push(this.generateGeoJson(item.support));
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

<template>
  <div ref="container" class="flex-container">
    <div class="container-main">
      <div class="row">
        <div class="col">
          <b-navbar
            toggleable="lg"
            type="dark"
            variant="primary"
            class="d-flex justify-content-end"
          >
            <b-navbar-brand href="#">{{ title }}</b-navbar-brand>

            <b-collapse id="nav-collapse" is-nav>
              <!-- Right aligned nav items -->
              <b-navbar-nav class="ml-auto">
                <b-nav-item to="/"><b-icon-house></b-icon-house></b-nav-item>
                <b-nav-item to="/systemz">SystemZ</b-nav-item>
                <b-nav-item to="/dashboards">Dashboards</b-nav-item>
              </b-navbar-nav>
            </b-collapse>
          </b-navbar>
        </div>
      </div>
      <div class="p-2">
        <Nuxt />
      </div>
    </div>
  </div>
</template>

<script>
import is from '@/mixins/is';
export default {
  name: 'NuxtTutorial',
  mixins: [is],
  data() {
    return {
      show: true,
      logo: require('@/assets/img/background.png'),
    };
  },
  computed: {
    title() {
      return this.$store.state.layout.title;
    },
  },
  mounted() {},
  destroy() {
    // window.removeEventListener('resize', this.onResize)
  },
  methods: {
    async logout() {
      await this.$auth.logout();
    },
  },
};
</script>

<style lang="scss" scoped>
.flex-container {
  display: flex;
  background-color: #f1f4f6;
}

.container-main {
  margin-right: 5px;
  margin-top: 5px;
  margin-bottom: 5 px;
  width: 100%;
  min-height: 100vh;
}
</style>

<template>
  <div ref="container" class="flex-container">
    <div class="container-main">
      <b-navbar toggleable="lg" type="dark" variant="primary">
        <b-navbar-brand href="#">{{ title }}</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item to="/"><b-icon-house></b-icon-house></b-nav-item>
            <b-nav-item to="/systemz">SystemZ</b-nav-item>
            <b-nav-item to="/dashboards">Dashboards</b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
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
    goToPrev() {
      this.$router.go(-1);
    },
    goToNext() {
      this.$router.go(1);
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active em versões anteriores a 2.1.8 */ {
  opacity: 0;
}
</style>

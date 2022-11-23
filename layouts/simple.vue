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
            <b-navbar-nav class="ml-auto">
              <b-collapse id="nav-collapse" is-nav>
                <!-- Right aligned nav items -->
                <client-only>
                  <b-navbar-nav class="ml-auto">
                    <b-nav-item to="/"
                      ><b-icon-house></b-icon-house
                    ></b-nav-item>
                    <b-nav-item to="/systemz">SystemZ</b-nav-item>
                    <b-nav-item to="/dashboards">Dashboards</b-nav-item>
                  </b-navbar-nav>
                </client-only>
              </b-collapse>
            </b-navbar-nav>


            <b-navbar-toggle
              v-show="$auth.loggedIn"
              target="nav-collapse"
            ></b-navbar-toggle>
            <button
              v-show="!show"
              type="button"
              class="btn btn-primary"
              @click="switchShow"
            >
              <b-icon icon="layout-text-sidebar"></b-icon>
            </button>
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
    switchShow() {
      this.show = !this.show;
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

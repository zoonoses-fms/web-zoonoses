<template>
  <div class="container-fluid">
    <div
      class="row justify-content-center"
    >
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card mb-4 shadow-sm">
          <div class="card-header">
            <h4 class="my-0 font-weight-normal">Dashboard</h4>
          </div>
          <div class="card-body">
            <h2 class="card-title pricing-card-title">Dengue</h2>
            <ul class="list-unstyled mt-3 mb-4">
              <li>Notificações de Dengue</li>
            </ul>
            <NuxtLink
              :to="`/dashboards/show/datasus/dengueon/${initial}`"
              class="btn btn-success"
            >
              Ir...
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardsPage',
  layout: 'simple',
  data() {
    return {
      initial: 'the',
    };
  },
  created() {
    this.welcomeMessage();
  },
  mounted() {},
  methods: {
    welcomeMessage() {
      this.$store.commit('layout/CHANGE_NAV_TITLE', 'Dashboard');
    },
  }
};
</script>

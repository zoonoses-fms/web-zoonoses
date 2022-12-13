<template>
  <div class="row justify-content-around">
    <div class="card-deck m-3 text-center">
      <div class="card mb-4 shadow-sm">
        <div class="card-header">
          <h4 class="my-0 font-weight-normal">NCRLOZ</h4>
        </div>
        <div class="card-body">
          <h1 class="card-title pricing-card-title">Núcleo</h1>
          <ul class="list-unstyled mt-3 mb-4">
            <li>Núcleo de Controle da Raiva, Leishmaniose e Outras Zoonoses</li>
          </ul>
          <NuxtLink to="/ncrlo" class="btn btn-success"> Ir... </NuxtLink>
        </div>
      </div>
      <div class="card mb-4 shadow-sm">
        <div class="card-header">
          <h4 class="my-0 font-weight-normal">NCRV</h4>
        </div>
        <div class="card-body">
          <h1 class="card-title pricing-card-title">Núcleo</h1>
          <ul class="list-unstyled mt-3 mb-4">
            <li>Núcleo de Controle de Roedores e Vetores</li>
          </ul>
          <NuxtLink to="/ncrv" class="btn btn-success"> Ir... </NuxtLink>
        </div>
      </div>
      <div class="card mb-4 shadow-sm">
        <div class="card-header">
          <h4 class="my-0 font-weight-normal">NC</h4>
        </div>
        <div class="card-body">
          <h1 class="card-title pricing-card-title">Núcleo</h1>
          <ul class="list-unstyled mt-3 mb-4">
            <li>Núcleo de Correição</li>
          </ul>
          <NuxtLink to="/nc" class="btn btn-success"> Ir... </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  mounted() {
    // this.$auth.refreshTokens();
  },
  created() {
    this.welcomeMessage();
  },
  methods: {
    welcomeMessage() {
      this.$store.commit('layout/CHANGE_NAV_TITLE', 'SystemZ');
    },
  },
};
</script>

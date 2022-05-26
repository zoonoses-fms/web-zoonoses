<template>
  <div class="row justify-content-around">
    <div class="card-deck mb-3 text-center">
      <div class="card mb-4 shadow-sm">
        <div class="card-header">
          <h4 class="my-0 font-weight-normal">Formulário DO</h4>
        </div>
        <div class="card-body">
          <h1 class="card-title pricing-card-title">Controle</h1>
          <ul class="list-unstyled mt-3 mb-4">
            <li>
              Controle de distribuição de formulários de declaração de óbito
            </li>
          </ul>
          <NuxtLink to="do" class="btn btn-success"> Ir... </NuxtLink>
        </div>
      </div>
      <div class="card mb-4 shadow-sm">
        <div class="card-header">
          <h4 class="my-0 font-weight-normal">Formulário DN</h4>
        </div>
        <div class="card-body">
          <h1 class="card-title pricing-card-title">Controle</h1>
          <ul class="list-unstyled mt-3 mb-4">
            <li>
              Controle de distribuição de formulários de declaração de nascido
              vivo
            </li>
          </ul>
          <NuxtLink to="dn" class="btn btn-success"> Ir... </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  auth: false,
  mounted() {
    // this.$auth.refreshTokens();
  },
};
</script>

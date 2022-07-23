<template>
  <div
    class="row justify-content-center row-cols-1 row-cols-md-2 row-cols-xl-3"
  >
    <div class="col mb-4">
      <div class="card mb-4 shadow-sm">
        <div class="card-header">
          <h4 class="my-0 font-weight-normal">Registros</h4>
        </div>
        <div class="card-body">
          <h2 class="card-title pricing-card-title">Encoleiramento</h2>
          <ul class="list-unstyled mt-3 mb-4">
            <li>Programa Nacional de Encoleiramento</li>
          </ul>
          <NuxtLink to="/ncrlo/collaring" class="btn btn-success">
            Ir...
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="col mb-4">
      <div class="card mb-4 shadow-sm">
        <div class="card-header">
          <h4 class="my-0 font-weight-normal">Campanha</h4>
        </div>
        <div class="card-body">
          <h2 class="card-title pricing-card-title">Vacinação</h2>
          <ul class="list-unstyled mt-3 mb-4">
            <li>Campanha de vacinação para cães e gatos</li>
          </ul>
          <NuxtLink to="/ncrlo/campaign" class="btn btn-success">
            Ir...
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NcrloPage',
};
</script>

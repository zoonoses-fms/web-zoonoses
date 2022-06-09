<template>
  <div class="row justify-content-around">
    <div class="card-deck mb-3 text-center">
      <div class="card mb-4 shadow-sm">
        <div class="card-header">
          <h4 class="my-0 font-weight-normal">Registros</h4>
        </div>
        <div class="card-body">
          <h1 class="card-title pricing-card-title">Encoleiramento</h1>
          <ul class="list-unstyled mt-3 mb-4">
            <li>Programa Nacional de Encoleiramento</li>
          </ul>
          <NuxtLink to="/ncrlo/collaring" class="btn btn-success"> Ir... </NuxtLink>
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

<template>
  <div class="row justify-content-around">
    <div class="card-deck mb-3 text-center">
      <div class="card mb-4 shadow-sm">
        <div class="card-header">
          <h4 class="my-0 font-weight-normal">SAADS</h4>
        </div>
        <div class="card-body">
          <h1 class="card-title pricing-card-title">Mapas</h1>
          <ul class="list-unstyled mt-3 mb-4">
            <li>SUPERINTENDÊNCIA DE AÇÕES ADMINISTRATIVAS DESCENTRALIZADAS</li>
          </ul>
          <NuxtLink to="/maps/saad" class="btn btn-success"> Ir... </NuxtLink>
        </div>
      </div>

      <div class="card mb-4 shadow-sm">
        <div class="card-header">
          <h4 class="my-0 font-weight-normal">Bairros</h4>
        </div>
        <div class="card-body">
          <h1 class="card-title pricing-card-title">Mapas</h1>
          <ul class="list-unstyled mt-3 mb-4">
            <li>Bairros de Teresina</li>
          </ul>
          <NuxtLink to="/maps/neighborhood" class="btn btn-success">
            Ir...
          </NuxtLink>
        </div>
      </div>

      <div class="card mb-4 shadow-sm">
        <div class="card-header">
          <h4 class="my-0 font-weight-normal">Quadras</h4>
        </div>
        <div class="card-body">
          <h1 class="card-title pricing-card-title">Mapas</h1>
          <ul class="list-unstyled mt-3 mb-4">
            <li>Quadras de Teresina</li>
          </ul>
          <NuxtLink to="/maps/block" class="btn btn-success">
            Ir...
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MapsPage',
};
</script>

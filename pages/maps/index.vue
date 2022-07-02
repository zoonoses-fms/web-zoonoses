<template>
  <div class="row justify-content-center row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4">
    <div class="col mb-4">
      <div class="card mb-4 shadow-sm">
        <div class="card-header">
          <h4 class="my-0 font-weight-normal">Mapas</h4>
        </div>
        <div class="card-body">
          <h1 class="card-title pricing-card-title">SAAD</h1>
          <ul class="list-unstyled mt-3 mb-4">
            <li>SUPERINTENDÊNCIA DE AÇÕES ADMINISTRATIVAS DESCENTRALIZADAS</li>
          </ul>
          <NuxtLink to="/maps/saad" class="btn btn-success"> Ir... </NuxtLink>
        </div>
      </div>
    </div>

    <div class="col mb-4">
      <div class="card mb-4 shadow-sm">
        <div class="card-header">
          <h4 class="my-0 font-weight-normal">Mapas</h4>
        </div>
        <div class="card-body">
          <h1 class="card-title pricing-card-title">Bairros</h1>
          <ul class="list-unstyled mt-3 mb-4">
            <li>Bairros de Teresina</li>
          </ul>
          <NuxtLink to="/maps/neighborhood" class="btn btn-success">
            Ir...
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="col mb-4">
      <div class="card mb-4 shadow-sm">
        <div class="card-header">
          <h4 class="my-0 font-weight-normal">Mapas</h4>
        </div>
        <div class="card-body">
          <h1 class="card-title pricing-card-title">Quadras</h1>
          <ul class="list-unstyled mt-3 mb-4">
            <li>Quadras de Teresina</li>
          </ul>
          <NuxtLink to="/maps/block" class="btn btn-success"> Ir... </NuxtLink>
        </div>
      </div>
    </div>

    <div class="col mb-4">
      <div class="card mb-4 shadow-sm">
        <div class="card-header">
          <h4 class="my-0 font-weight-normal">Mapas</h4>
        </div>
        <div class="card-body">
          <h1 class="card-title pricing-card-title">Sub Localidades</h1>
          <ul class="list-unstyled mt-3 mb-4">
            <li>Sub localidades de Teresina</li>
          </ul>
          <NuxtLink to="/maps/sub-loacation" class="btn btn-success">
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

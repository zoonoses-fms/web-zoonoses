<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-12 col-lg-4 col-xl-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">SIM</h5>
            <p class="card-text">
              Sistema de Informação sobre Mortalidade – SIM
            </p>
            <NuxtLink
              :to="`/datasets/load/datasus/sim/${initial}`"
              class="btn btn-primary"
            >
              Enviar arquivo
            </NuxtLink>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-lg-4 col-xl-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">SINASC</h5>
            <p class="card-text">
              Sistema de Informações sobre Nascidos Vivos - SINASC
            </p>
            <NuxtLink
              :to="`/datasets/load/datasus/sinasc/${initial}`"
              class="btn btn-primary"
            >
              Enviar arquivo
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LocationInitial',
  data() {
    return {
      initial: 'the',
    };
  },
};
</script>

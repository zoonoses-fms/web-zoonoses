<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-12 col-lg-4 col-xl-3">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Sinan Dengue Online</h5>
            <p class="card-text">
              Notificações de dengue de Teresina
            </p>
            <NuxtLink
              :to="`/datasets/load/datasus/dengueon/${initial}`"
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
  name: 'DatasetsPage',
  data() {
    return {
      initial: 'the',
    };
  },
};
</script>

<template>
  <main class="container-fluid">
    {{ $route.params }}
    <div class="row m-2 justify-content-between"></div>
    <div class="row justify-content-between"></div>
  </main>
</template>

<script>
export default {
  name: 'VaccinationSupportPointPage',
  data() {
    return {
      listSupportPoint: [],
      listVaccinationSupportPoint: [],
      urlSupportPoint: '',
    };
  },

  methods: {
    async getSupportPoint() {},
  },
};
</script>

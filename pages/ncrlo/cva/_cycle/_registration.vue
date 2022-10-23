<template>
  <div>
    params: {{ $route.params }}
    <p>worker: {{ $store.getters['cva/GET_WORKER'] }}</p>
  </div>
</template>

<script>
export default {
  name: 'ListLocationWorker',
  auth: 'guest',
  layout: 'simple',
  created() {
  },
};
</script>

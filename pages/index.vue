<template>
  <div class="row justify-content-around">

  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  layout: 'simple',
  auth: false,
  created() {
    this.$router.push('/ncrlo/campaign/cycle/map/points/public/1');
  },
  mounted() {
    // this.$auth.refreshTokens();
  },
};
</script>

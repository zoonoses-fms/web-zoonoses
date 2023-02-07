<template>
  <div class="row justify-content-around">

  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  layout: 'site',
  auth: false,
  created() {
    this.$router.push('/site');
  },
  mounted() {
    // this.$auth.refreshTokens();
  },
};
</script>

<template>
  <main class="form-signin">
    <CardsUser :user="user"></CardsUser>
  </main>
</template>

<script>
import is from '@/mixins/is';
export default {
  name: 'ProfilePage',
  mixins: [is],
  data() {
    return {
      show: true,
      user: this.$auth.user,
      logo: require('@/assets/img/background.png'),
    };
  },

  methods: {},
};
</script>

<style>
.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin-top: 15px;
  margin-left: auto;
  margin-right: auto;
}
</style>

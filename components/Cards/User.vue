<template>
  <div class="card">
    <img :src="logo" class="card-img-top" alt="logo" />
    <b-avatar size="10em" class="centered-avatar"></b-avatar>
    <div class="card-body">
      <div class="row">
        <div class="col"><em>Nome: </em> {{ user.name }}</div>
      </div>
      <div class="row">
        <div class="col"><em>E-mail: </em> {{ user.email }}</div>
      </div>
      <div class="row">
        <div class="col"><em>Telefone: </em> {{ user.phone }}</div>
      </div>
    </div>
    <div class="row"></div>
  </div>
</template>

<script>
import is from '@/mixins/is';
export default {
  name: 'CardsUser',
  mixins: [is],
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      logo: require('@/assets/img/background.png'),
    };
  },
};
</script>

<style>
.centered-avatar {
  position: fixed;
  transform: translate(44%, 50%);
}
</style>

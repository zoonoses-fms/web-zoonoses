<template>
  <div class="card shadow m-2 p-2">
    <h5 class="card-title">Controles:</h5>

    <b-form-checkbox
      v-model="controlItens"
      value="rubber-shop"
      name="check-button"
      switch
      @change="changeControl"
    >
      Borracharias
    </b-form-checkbox>
  </div>
</template>

<script>
export default {
  name: 'CardControlElementMap',
  data() {
    return {
      controlItens: [],
    };
  },
  methods: {
    changeControl(itens){
      this.$emit('changeControl', itens);
    }
  }
};
</script>

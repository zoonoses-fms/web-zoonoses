<template>
  <div class="input-group-append">
    <b-button v-b-modal.modal-add-profile class="btn"
      >Adicionar</b-button
    >

    <b-modal id="modal-add-profile" title="Adicionar Perfil">
      <p class="my-4">Hello from modal!</p>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'ModalAddProfile',
};
</script>

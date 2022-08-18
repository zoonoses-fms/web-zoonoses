<template>
  <div>
    <b-button v-b-modal="`delete-modal-${item.id}`" variant="danger">
      <b-icon icon="trash"></b-icon>
      {{ textButton }}
    </b-button>

    <b-modal :id="`delete-modal-${item.id}`" :title="`${textButton} item`" hide-footer>
      <p class="my-4">Deseja realmente {{ textButton }} ?</p>
      <b-button
        variant="success"
        class="mt-3"
        block
        @click="$bvModal.hide(`delete-modal-${item.id}`)"
        >Cancelar</b-button
      >
      <b-button variant="danger" class="mt-3" block @click="deleteItem"
        >Excluir</b-button
      >
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'ModalDelete',
  props: {
    item: {
      type: Object,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    textButton: {
      type: String,
      default: 'Excluir'
    }
  },
  methods: {
    async deleteItem() {
      try {
        await this.$axios.delete(`${this.url}${this.item.id}/`);
        this.$bvModal.hide(`delete-modal-${this.item.id}`);
        this.$emit('deletItem', { delete: true });
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>

<template>
  <div class="card border-0 rounded-lg shadow">
    <div v-if="isCardHeader" class="border-left border-primary border-4 m-0 px-1">
      <slot name="card-header" />
    </div>
    <div class="card-body">
      <div v-if="isCardTitle" class="card-title text-primary title-shadow m-0">
        <slot name="card-title" />
      </div>
      <div class="card-text">
        <slot />
      </div>
    </div>
    <div v-if="isCardFooter" class="card-footer text-muted text-right">
      <slot name="card-footer" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardsNews',
  computed: {
    isCardHeader() {
      if (this.$slots['card-header'] === undefined) {
        return false;
      }
      return true;
    },
    isCardTitle() {
      if (this.$slots['card-title'] === undefined) {
        return false;
      }
      return true;
    },
    isCardFooter() {
      if (this.$slots['card-footer'] === undefined) {
        return false;
      }
      return true;
    }
  },
  mounted() {
  },
};
</script>

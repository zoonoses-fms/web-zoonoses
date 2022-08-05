<template>
  <div>
    <multiselect
      v-model="selected"
      :options.sync="listWorkers"
      :searchable="true"
      :close-on-select="!multiple"
      :show-labels="true"
      deselect-label="Clique para remover"
      select-label="Clique para selecionar"
      selected-label="Selecionado"
      :multiple="multiple"
      track-by="id"
      label="name"
      placeholder="Selecione"
      :allow-empty="true"
    >
      <template slot="singleLabel" slot-scope="{ option }">
        <strong>{{ option.name }}</strong> Matrícula
        <strong>{{ option.registration }}</strong>
      </template>
    </multiselect>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';

export default {
  name: 'FormSelectSaad',
  components: {
    Multiselect,
  },
  props: {
    selectedSaads: {
      required: true,
      validator: (prop) =>
        typeof prop === 'number' || Array.isArray(prop) || prop === null,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    preLoadingList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      selected: null,
      listWorkers: [],
      url: 'map/saad/',
      value: null,
    };
  },
  watch: {
    selected(value) {
      if (Array.isArray(value)) {
        const itens = [];
        for (const item of value) {
          itens.push(item.id);
        }
        this.$emit('change', itens);
      } else if (value === null) {
        this.$emit('change', null);
      } else {
        this.$emit('change', value.id);
      }
    },
  },
  created() {
    if (this.preLoadingList.length > 0) {
      this.listWorkers = [...this.preLoadingList];
      this.preSelectedSaad();
    } else {
      this.getSaads();
    }
  },
  methods: {
    async getSaads() {
      const params = {
        keyword: '',
      };

      try {
        const response = await this.$axios.get(this.url, { params });

        this.listWorkers = response.data;
        this.preSelectedSaad();
      } catch (error) {
        console.log(error);
      }
    },
    preSelectedSaad() {
      if (this.multiple && Array.isArray(this.selectedSaads)) {
        this.selected = this.listWorkers.filter((worker) => {
          return this.selectedSaads.some((select) => {
            return select.id === worker.id;
          });
        });
      } else if (typeof this.selectedSaads === 'number') {
        this.selected = this.listWorkers.find((worker) => {
          return worker.id === this.selectedSaads;
        });
      }
    },
  },
};
</script>
<style>
/* stylelint-disable-line */
.multiselect__content-wrapper {
  z-index: -1;
  position: fixed;
  width: 78%;
}

@media (min-width: 768px) {
  .multiselect__content-wrapper {
    width: 36%;
  }
}
</style>

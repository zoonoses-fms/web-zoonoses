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
  name: 'FormSelectWorker',
  components: {
    Multiselect,
  },
  props: {
    campaignCycleId: {
      type: [String, Number],
      required: true,
    },
    selectedWorker: {
      required: true,
      validator: (prop) =>
        typeof prop === 'number' || Array.isArray(prop) || prop === null,
    },
    listType: {
      type: String,
      required: true,
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
      url: 'ncrlo/vaccination/worker/',
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
      this.preSelectedWorker();
    } else {
      this.getWorker();
    }
  },
  methods: {
    async getWorker() {
      const params = {};

      if (this.campaignCycleId != null) {
        params.campaign_cycle_id = this.campaignCycleId;

        if (this.selectedWorker === null) {
          params.list_type = 'free';
        } else if (typeof this.selectedWorker === 'number') {
          params.list_type = this.listType;
          params.coordinator_id = this.selectedWorker;
        } else if (Array.isArray(this.selectedWorker)) {
          if (this.selectedWorker.length > 0) {
            params.list_type = this.listType;

            params.ids = [];
            for (const worker of this.selectedWorker) {
              params.ids.push(worker.id);
            }
          } else {
            params.list_type = 'free';
          }
        }
      } else {
        params.list_type = 'all';
      }

      try {
        const response = await this.$axios.get(this.url, { params });

        this.listWorkers = response.data;
        this.preSelectedWorker();
      } catch (error) {
        console.log(error);
      }
    },
    preSelectedWorker() {
      if (this.multiple && Array.isArray(this.selectedWorker)) {
        this.selected = this.listWorkers.filter((worker) => {
          return this.selectedWorker.some((select) => {
            return select.id === worker.id;
          });
        });
      } else if (typeof this.selectedWorker === 'number') {
        console.log(this.selectedWorker);
        this.selected = this.listWorkers.find((worker) => {
          return worker.id === this.selectedWorker;
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

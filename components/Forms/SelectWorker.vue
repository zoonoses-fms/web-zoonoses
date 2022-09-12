<template>
  <div class="d-flex">
    <div class="flex-grow-1">
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
    <div v-if="preLoadingList === null" class="align-self-stretch">
      <FormsVaccinationWorker
        :name-modal="listType"
        text-button=""
        variant="success"
        :url="url"
        @create="setWorker"
      >
        <template #button>
          <b-icon icon="person-plus" />
        </template>
      </FormsVaccinationWorker>
    </div>
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
      required: true,
      validator: (prop) =>
        typeof prop === 'number' || typeof prop === 'string' || prop === null,
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
        return null;
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
    if (Array.isArray(this.preLoadingList)) {
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
        this.selected = this.listWorkers.find((worker) => {
          return worker.id === this.selectedWorker;
        });
      }
    },
    setWorker(worker) {
      this.selected.push(worker);
    }
  },
};
</script>
<style>
/* stylelint-disable-line */
.multiselect__content-wrapper {
  z-index: -1;
  position: fixed;
  width: 78%;
  display: contents;
}

@media (min-width: 768px) {
  .multiselect__content-wrapper {
    width: 36%;
  }
}
</style>

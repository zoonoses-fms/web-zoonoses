<template>
  <div>
    <b-form-select
      v-model="selected"
      :select-size="4"
      :multiple="multiple"
      class="mb-3"
    >
      <b-form-select-option
        v-for="worker in listWorkers"
        :key="worker.id"
        :value="worker.id"
      >
        {{ worker.name }}
      </b-form-select-option>
    </b-form-select>

    <div class="mt-2">
      Selected: <strong>{{ selected }}</strong>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormSelectWorker',
  props: {
    campaignId: {
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
  },
  data() {
    return {
      selected: null,
      listWorkers: [],
      url: 'ncrlo/vaccination/worker/',
      fields: [
        {
          key: 'selected',
          label: '',
          sortable: true,
        },
        {
          key: 'name',
          label: 'Nome',
          sortable: true,
        },
      ],
    };
  },
  watch: {
    selected(value) {
      this.$emit('change', value);
    },
  },
  created() {
    this.getWorker();
  },
  methods: {
    async getWorker() {
      const params = {
        campaign_id: this.campaignId,
      };

      if (this.selectedWorker === null) {
        params.list_type = 'free';
      } else if (this.selectedWorker === 'string') {
        params.list_type = this.listType;
        params.coordinator_id = this.selectedWorker;
      } else if (Array.isArray(this.selectedWorker)) {
        if (this.selectedWorker.length > 0) {
          params.list_type = this.listType;
          params.supervisors_ids = this.selectedWorker;
        }
        params.list_type = 'free';
      }

      try {
        const response = await this.$axios.get(this.url, { params });

        this.listWorkers = response.data;
        this.selected = this.selectedWorker;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

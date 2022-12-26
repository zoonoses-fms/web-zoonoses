<template>
  <div class="ml-1">
    <b-button
      v-b-modal="`modal-md-search-${cycle_id}`"
      :variant="variant"
      @click="showForm"
    >
      <b-icon-search></b-icon-search>
      <b-icon-people></b-icon-people>
      Buscar Colaborador
    </b-button>
    <b-modal
      :id="`modal-md-search-${cycle_id}`"
      size="xl"
      scrollable
      :title="title"
      hide-footer
    >
      <b-overlay :show="showOverlay" rounded="sm">
        <div class="input-group mb-3">
          <input
            v-model="search"
            type="text"
            class="form-control"
            placeholder="Nome do colaborador"
            aria-label="Nome do colaborador"
            aria-describedby="search"
            @keyup.enter="getRows"
          />
          <div class="input-group-append">
            <b-button id="search" class="input-group-text" @click="getRows">
              <b-icon-search></b-icon-search>
            </b-button>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <BCard>
              <BTable
                id="table-supports"
                striped
                responsive
                hover
                small
                :fields="fields"
                :items="rows"
                primary-key="id"
              >
                <template #cell(name)="data">
                  {{ data.item.name }}
                </template>
                <template #cell(occupation)="data">
                  {{ data.item.occupation }}
                </template>
                <template #cell(location)="data">
                  {{ data.item.location }}
                </template>
              </BTable>
            </BCard>
          </div>
        </div>
      </b-overlay>
    </b-modal>
  </div>
</template>

<script>
export default {
  props: {
    variant: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    cycleId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      url: 'ncrlo/vaccination/worker/search/',
      showOverlay: false,
      search: '',
      cycle_id: null,
      rows: [],
      fields: [
        {
          key: 'name',
          label: 'Name',
          sortable: true,
        },
        {
          key: 'occupation',
          label: 'Função',
          sortable: true,
        },
        {
          key: 'location',
          label: 'Local',
          sortable: true,
        },
      ],
    };
  },
  methods: {
    showForm() {
      console.log('show');
    },
    handleOk() {
      console.log('handleOk');
    },
    async getRows() {
      this.showOverlay = true;
      const params = {
        cycle_id: this.cycleId,
      };

      if (this.search.length > 3) {
        params.keyword = this.search;
      }

      try {
        const response = await this.$axios.get(`${this.url}`, {
          params,
        });
        this.rows = await response.data;
      } catch (error) {
        /* if(error.response.status === 401) {
                  this.$router.push('/');
                } */
      }
      this.showOverlay = false;
    },
  },
};
</script>

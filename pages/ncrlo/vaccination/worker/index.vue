<template>
  <main class="container-fluid">
    <div class="row">
      <div class="col-sm-12 col-md-4 col-lg-6 d-flex justify-content-start">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          class="pagination-danger"
          @input="getRows"
        ></b-pagination>
      </div>
      <div class="col-sm-12 col-md-4 col-lg-3 d-flex justify-content-end">
        <div class="form-group border border-success rounded p-1">
          <div class="input-group">
            <input
              v-model="search"
              name="name-input"
              class="form-control"
              type="text"
              placeholder="Nome:"
              @keyup.enter="getRows"
            />
            <div class="input-group-append">
              <button
                class="btn btn-outline-success"
                type="button"
                @click="getRows"
              >
                <b-icon icon="search"></b-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-4 col-lg-3 d-flex justify-content-end">
        <FormsVaccinationWorker
          text-button="Cadastrar Equipe"
          variant="success"
          :url="url"
          @create="getRows"
        ></FormsVaccinationWorker>
      </div>
    </div>
    <div class="row justify-content-between">
      <div class="col-12">
        <b-card>
          <b-table
            id="table-supports"
            striped
            responsive
            hover
            small
            :fields="fields"
            :items="rows"
            primary-key="id"
          >
            <template #cell(id)="data">
              {{ data.item.id }}
            </template>
            <template #cell(name)="data">
              {{ data.item.name }}
            </template>
            <template #cell(address)="data">
              {{ data.item.address }}
            </template>
            <template #cell(number)="data">
              {{ data.item.number }}
            </template>
            <template #cell(geometry)="data">
              <b-icon
                v-show="data.item.geometry != null"
                icon="pin-map"
              ></b-icon>
            </template>
            <template #cell(neighborhood)="data">
              {{ data.item.neighborhood }}
            </template>
            <template #cell(edit)="data">
              <FormsVaccinationWorker
                text-button="Editar"
                variant="success"
                :old-worker="data.item"
                :url="url"
                @update="getRows"
              ></FormsVaccinationWorker>
            </template>
            <template #cell(delete)="data">
              <ModalDelete
                :item="data.item"
                :url="url"
                text-button="Remover"
                @deletItem="getRows"
              >
              </ModalDelete>
            </template>
          </b-table>
        </b-card>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'VaccinationWorkerPage',
  data() {
    return {
      url: 'ncrlo/vaccination/worker/',
      fields: [
        {
          key: 'id',
          label: 'Id',
          sortable: true,
        },
        {
          key: 'name',
          label: 'Nome',
          sortable: true,
        },
        {
          key: 'registration',
          label: 'Matrícula',
          sortable: true,
        },
        {
          key: 'phone',
          label: 'Telefone',
          sortable: true,
        },
        {
          key: 'cpf',
          label: 'CPF',
          sortable: true,
        },
        {
          key: 'edit',
          label: 'Editar',
        },
        {
          key: 'delete',
          label: 'Excluir',
        },
      ],
      perPage: 10,
      currentPage: 1,
      totalRows: 0,
      search: '',
      rows: [],
    };
  },
  created() {
    this.getRows();
    this.welcomeMessage();
  },
  methods: {
    welcomeMessage() {
      this.$store.commit('layout/CHANGE_NAV_TITLE', 'Lista de Equipe');
    },
    async getRows() {
      const params = {
        per_page: this.perPage,
        page: this.currentPage,
      };

      if (this.search.length > 3) {
        params.keyword = this.search;
      }
      try {
        const response = await this.$axios.get(`${this.url}`, {
          params,
        });
        this.rows = await response.data.data;
        this.totalRows = await response.data.total;
      } catch (error) {
        /* if(error.response.status === 401) {
                  this.$router.push('/');
                } */
      }
    },
  },
};
</script>

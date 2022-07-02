<template>
<main class="container-fluid">
  <div class="row m-2 justify-content-between">
    <div class="col-sm-12 col-md-6"></div>
    <div class="col-sm-12 col-md-6 d-flex justify-content-end">
      <FormsVaccinationCampaign text-button="Cadastrar campanha" variant="primary"></FormsVaccinationCampaign>
    </div>
  </div>
  <div class="row justify-content-between">
    <div class="col-12">
      <b-card class="text-center">
        <b-table id="table-campaigns" striped responsive hover :fields="fields" :items="rows" primary-key="id">
          <template #cell(id)="data">
            {{ data.item.id }}
          </template>
          <template #cell(name)="data">
            {{ data.item.year }}
          </template>
          <template #cell(email)="data">
            {{ data.item.start }}
          </template>
          <template #cell(support)="data">
            <NuxtLink :to="`/ncrlo/vaccination/support/${data.item.id}`" class="btn btn-warning">
              Suporte
            </NuxtLink>
          </template>
          <template #cell(delete)="data">
            <ModalDelete :item="data.item" :url="url" @deletItem="getRows">
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
  name: 'VaccinationPage',
  data() {
    return {
      url: 'ncrlo/campaign/',
      fields: [{
          key: 'id',
          label: 'Id',
          sortable: true
        },
        {
          key: 'year',
          label: 'Ano',
          sortable: true
        },
        {
          key: 'start',
          label: 'Início',
          sortable: true
        },
        {
          key: 'support',
          label: 'Suporte'
        },
        {
          key: 'delete',
          label: 'Excluir'
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
      this.$store.commit('layout/CHANGE_NAV_TITLE', 'Campanhas de vacinação');
    },
    async getRows() {
      try {
        const response = await this.$axios.get(`${this.url}`, {
          params: {
            per_page: this.perPage,
            page: this.currentPage,
          },
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

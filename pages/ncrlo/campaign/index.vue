<template>
  <main class="container-fluid">
    <div class="row m-2 justify-content-between">
      <div class="col-sm-12 col-md-6"></div>
      <div class="col-sm-12 col-md-6 d-flex justify-content-end">
        <FormsVaccinationCampaign
          text-button="Cadastrar campanha"
          variant="primary"
          @create="getRows"
        ></FormsVaccinationCampaign>
      </div>
    </div>
    <div class="row justify-content-between">
      <div class="col-12">
        <b-card>
          <b-table
            id="table-campaigns"
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
              {{ data.item.year }}
            </template>
            <template #cell(email)="data">
              {{ data.item.start }}
            </template>
            <template #cell(details)="data">
              <NuxtLink
                :to="`/ncrlo/campaign/${data.item.id}`"
                class="btn btn-warning"
              >
                Detalhes
              </NuxtLink>
            </template>
            <template #cell(points)="data">
              <NuxtLink
                :to="`/ncrlo/campaign/map/points/${data.item.id}`"
                class="btn btn-success"
              >
                <b-icon icon="map"></b-icon>
                Ponto de Vacinação
              </NuxtLink>
            </template>
            <template #cell(supports)="data">
              <NuxtLink
                :to="`/ncrlo/campaign/map/supports/${data.item.id}`"
                class="btn btn-info"
              >
                <b-icon icon="map"></b-icon>
                Ponto de Apoios
              </NuxtLink>
            </template>
            <template #cell(edit)="data">
              <FormsVaccinationCampaign
                text-button="Editar"
                variant="success"
                :old-vaccination-campaign="data.item"
                @update="getRows"
              ></FormsVaccinationCampaign>
            </template>
            <template #cell(delete)="data">
              <ModalDelete
                :item="data.item"
                :url="url"
                text-button="Excluir"
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
  name: 'CampaignPage',
  data() {
    return {
      url: 'ncrlo/campaign/',
      fields: [
        {
          key: 'id',
          label: 'Id',
          sortable: true,
        },
        {
          key: 'year',
          label: 'Ano',
          sortable: true,
        },
        {
          key: 'start',
          label: 'Início',
          sortable: true,
        },
        {
          key: 'details',
          label: 'Detalhes',
        },
        {
          key: 'points',
          label: 'Ponto de Vacinação',
        },
        {
          key: 'supports',
          label: 'Ponto de Apoios',
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

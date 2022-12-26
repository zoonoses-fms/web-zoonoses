<template>
  <main class="container-fluid">
    <div class="row m-2 justify-content-between">
      <div class="col-sm-12 col-md-6"></div>
      <div class="col-sm-12 col-md-6 d-flex justify-content-end">
        <LazyFormsCampaign
          text-button="Cadastrar campanha"
          variant="primary"
          @create="getRows"
        ></LazyFormsCampaign>
      </div>
    </div>
    <div class="row justify-content-between">
      <div class="col-12">
        <BCard>
          <BTable
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
            <template #cell(report)="data">
              <b-button
                class="mt-0"
                variant="warning"
                :to="`/ncrlo/campaign/report/${data.item.id}`"
              >
                <b-icon-bar-chart></b-icon-bar-chart>
              </b-button>
            </template>
            <template #cell(details)="data">
              <NuxtLink
                :to="`/ncrlo/campaign/${data.item.id}`"
                class="btn btn-warning"
              >
                <b-icon-search></b-icon-search>
              </NuxtLink>
            </template>
            <template #cell(edit)="data">
              <LazyFormsCampaign
                text-button=""
                variant="success"
                :old-campaign="data.item"
                @input="feedback"
              ></LazyFormsCampaign>
            </template>
            <template #cell(delete)="data">
              <LazyModalDelete
                :item="data.item"
                :url="url"
                text-button=""
                @deletItem="getRows"
              >
              </LazyModalDelete>
            </template>
          </BTable>
        </BCard>
      </div>
    </div>
  </main>
</template>

<script>
import toast from '@/mixins/toast';
export default {
  name: 'CampaignPage',
  mixins: [toast],
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
          key: 'report',
          label: 'Relat.',
        },
        {
          key: 'details',
          label: 'Detalhes',
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
    feedback(params) {
      this.toast(params);
      this.getRows();
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

<template>
  <main class="container-fluid">
    <div class="row m-2 justify-content-between">
      <div class="col-sm-12 col-md-6"></div>
      <div class="col-sm-12 col-md-6 d-flex justify-content-end">
        <FormsAddSupport
          text-button="Adicionar Apoio"
          variant="primary"
        ></FormsAddSupport>
      </div>
    </div>
    <div class="row justify-content-between">
      <div class="col-12">
        <b-card class="text-center">
          <b-table
            id="table-campaign-supports"
            striped
            responsive
            hover
            :fields="fields"
            :items="campaignSupports"
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
            <template #cell(support)="data">
              <NuxtLink
                :to="`/ncrlo/campaign/support/${data.item.id}`"
                class="btn btn-warning"
              >
                Detalhes
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
  name: 'CampaignDetailsPage',
  data() {
    return {
      campaign: null,
      campaignSupports: [],
      vaccinationSupports: [],
      url: 'ncrlo/campaign',
      fields: [
        {
          key: 'id',
          label: 'Id',
          sortable: true,
        },
        {
          key: 'name',
          label: 'Name',
          sortable: true,
        },
        {
          key: 'address',
          label: 'Endereço',
          sortable: true,
        },
        {
          key: 'number',
          label: 'Número',
        },
        {
          key: 'support',
          label: 'Suporte',
        },
        {
          key: 'delete',
          label: 'Excluir',
        },
      ],
      campaigns: {
        perPage: 10,
        currentPage: 1,
        totalRows: 0,
        search: '',
        rows: [],
        url: 'ncrlo/campaign/support',
      },
      vaccinations: {
        perPage: 10,
        currentPage: 1,
        totalRows: 0,
        search: '',
        rows: [],
        url: 'ncrlo/vaccination/support',
      },
    };
  },

  created() {
    this.getDetailCampaign();
    this.welcomeMessage();
  },
  methods: {
    welcomeMessage() {
      this.$store.commit(
        'layout/CHANGE_NAV_TITLE',
        'Pontos de apoi a campanhas de vacinação'
      );
    },
    async getDetailCampaign() {
      const response = await this.$axios.get(
        `${this.url}/${this.$route.params.id}`
      );
      this.campaign = response.data;

      this.campaign.supports.forEach((supportPoint) => {
        this.campaignSupports.push(supportPoint.support);
      });
    },
    async getRows() {
      try {
        const response = await this.$axios.get(`${this.vaccination.url}`, {
          params: {
            per_page: this.perPage,
            page: this.currentPage,
          },
        });
        this.campaigns.rows = await response.data.data;
        this.campaigns.totalRows = await response.data.total;
      } catch (error) {
        /* if(error.response.status === 401) {
          this.$router.push('/');
        } */
      }
    },
  },
};
</script>

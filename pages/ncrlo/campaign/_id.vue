<template>
  <main class="container-fluid">
    <div class="row m-2 justify-content-between">
      <div class="col-sm-12 col-md-6 d-flex justify-content-star"></div>
      <div class="col-sm-12 col-md-6 d-flex justify-content-end">
        <FormsCampaignCycle
          text-button="Cadastrar Etapa"
          variant="primary"
          :current-campaign.sync="campaign"
          @create="getDetailCampaign"
        ></FormsCampaignCycle>
      </div>
    </div>
    <div class="row justify-content-between">
      <div class="col-12">
        <b-card>
          <b-table
            id="table-campaign-new-supports"
            striped
            responsive
            hover
            small
            :fields="fields"
            :items="cycles"
            primary-key="id"
          >
            <template #cell(pendency)="data">
              <div class="d-flex justify-content-center">
                <b-icon
                  v-if="data.item.pendency"
                  icon="exclamation-circle"
                  variant="danger"
                  font-scale="2"
                ></b-icon>
                <b-icon
                  v-else
                  icon="check-circle"
                  variant="success"
                  font-scale="2"
                ></b-icon>
              </div>
            </template>
            <template #cell(number)="data">
              {{ data.item.number }}
            </template>
            <template #cell(start)="data">
              {{ data.item.start }}
            </template>
            <template #cell(end)="data">
              {{ data.item.end }}
            </template>
            <template #cell(edit)="data">
              <FormsCampaignCycle
                text-button=""
                variant="success"
                :old-campaign-cycle="data.item"
                :current-campaign.sync="campaign"
                @update="getDetailCampaign"
              ></FormsCampaignCycle>
            </template>
            <template #cell(details)="data">
              <NuxtLink
                :to="`/ncrlo/campaign/cycle/${data.item.id}`"
                class="btn btn-warning"
              >
                <b-icon icon="search"></b-icon>
              </NuxtLink>
            </template>
            <template #cell(delete)="data">
              <ModalDelete
                :item="data.item"
                :url="urlCampaignCycle"
                text-button=""
                @deletItem="getDetailCampaign"
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
  name: 'CampaignDetailsPage',
  data() {
    return {
      campaign: {
        year: ''
      },
      cycles: [],
      url: 'ncrlo/campaign/',
      urlCampaignCycle: 'ncrlo/campaign/cycle/',
      fields: [
        {
          key: 'number',
          label: 'Número',
          sortable: true,
        },
        {
          key: 'start',
          label: 'Início',
          sortable: true,
        },
        {
          key: 'end',
          label: 'Fim',
          sortable: true,
        },
        {
          key: 'edit',
          label: 'Editar',
        },
        {
          key: 'details',
          label: 'Detalhes',
        },
        {
          key: 'delete',
          label: 'Excluir',
        },
      ],
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
        `Etapas da Campanha ${this.campaign.year}`
      );
    },
    async getDetailCampaign() {
      this.cycles = [];

      const response = await this.$axios.get(
        `${this.url}${this.$route.params.id}`
      );
      this.campaign = response.data;

      this.cycles = this.campaign.cycles;
    },
  },
};
</script>

<template>
  <main class="container-fluid">
    <div class="row m-2 justify-content-between">
      <div class="col-sm-12 col-md-6 d-flex justify-content-star">
        <NuxtLink to="/ncrlo/vaccination/support" class="btn btn-success">
          Todos os Pontos de Apoio
        </NuxtLink>
      </div>
      <div class="col-sm-12 col-md-6 d-flex justify-content-end">
        <FormsAddSupport
          text-button="Adicionar Apoio"
          variant="primary"
          :current-campaign.sync="campaign"
          @addSupport="addSupport"
        ></FormsAddSupport>
      </div>
    </div>
    <div v-if="newCampaignSupports.length > 0">
      <div class="row justify-content-between">
        <div class="col-12">
          <b-card class="text-center">
            <template #header>
              <div class="row m-0">
                <div class="col-sm-12 col-md-6 d-flex justify-content-start">
                  <h5 class="mb-0">Novos Ponto de Apoio</h5>
                </div>
                <div class="col-sm-12 col-md-6 d-flex justify-content-end">
                  <b-button variant="success" @click="saveSupport">
                    Salvar
                  </b-button>
                </div>
              </div>
            </template>
            <b-table
              id="table-campaign-supports"
              striped
              responsive
              hover
              :fields="fields"
              :items="newCampaignSupports"
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
                <ModalDelete
                  :item="data.item"
                  :url="urlCampaignSupport"
                  text-button="Remover"
                  @deletItem="getDetailCampaign"
                >
                </ModalDelete>
              </template>
            </b-table>
          </b-card>
        </div>
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
            :items="campaignSupports"
            primary-key="id"
          >
            <template #cell(id)="data">
              {{ data.item.id }}
            </template>
            <template #cell(name)="data">
              {{ data.item.support.name }}
            </template>
            <template #cell(address)="data">
              {{ data.item.support.address }}
            </template>
            <template #cell(number)="data">
              {{ data.item.support.number }}
            </template>
            <template #cell(edit)="data">
              <FormsCampaignSupport
                text-button="Editar"
                variant="success"
                :old-support="data.item"
              ></FormsCampaignSupport>
            </template>
            <template #cell(details)="data">
              <NuxtLink
                :to="`/ncrlo/campaign/support/${data.item.id}`"
                class="btn btn-warning"
              >
                Detalhes
              </NuxtLink>
            </template>
            <template #cell(delete)="data">
              <ModalDelete
                :item="data.item"
                :url="urlCampaignSupport"
                text-button="Remover"
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
      campaign: {},
      campaignSupports: [],
      newCampaignSupports: [],
      url: 'ncrlo/campaign/',
      urlCampaignSupport: 'ncrlo/campaign/support/',
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
        'Pontos de apoio a campanhas de vacinação'
      );
    },
    async getDetailCampaign() {
      this.campaignSupports = [];

      const response = await this.$axios.get(
        `${this.url}${this.$route.params.id}`
      );
      this.campaign = response.data;

      this.campaign.supports.forEach((supportPoint) => {
        this.campaignSupports.push(supportPoint);
      });
    },
    addSupport(support) {
      this.newCampaignSupports.push({ ...support, _rowVariant: 'success' });
    },
    async saveSupport() {
      for (let index = 0; index < this.newCampaignSupports.length; index++) {
        const element = this.newCampaignSupports[index];

        try {
          await this.$axios.post(`${this.urlCampaignSupport}`, {
            ...element,
            campaign_id: this.$route.params.id,
          });
          this.$bvToast.toast('Cadastro efetuado!', {
            title: 'Sucesso',
            autoHideDelay: 5000,
            variant: 'success',
            solid: true,
          });
        } catch (errors) {
          for (const prop in errors.response.data) {
            errors.response.data[prop].forEach((element) => {
              this.$bvToast.toast(element, {
                title: 'Error',
                autoHideDelay: 5000,
                variant: 'danger',
                solid: true,
              });
            });
          }
          continue;
        }
      }
      this.newCampaignSupports = [];
      this.getDetailCampaign();
    },
  },
};
</script>

<template>
  <main class="container-fluid">
    <div class="row m-2 justify-content-between">
      <div class="col-sm-12 col-md-6">
        <NuxtLink to="/ncrlo/vaccination/point" class="btn btn-success">
          Lista de todos pontos de vacinação
        </NuxtLink>
      </div>
      <div class="col-sm-12 col-md-6 d-flex justify-content-end">
        <FormsAddPoint
          text-button="Adicionar Ponto"
          variant="primary"
          :current-support.sync="support"
          @addSupport="addPoint"
        ></FormsAddPoint>
      </div>
    </div>
    <div v-if="newCampaignPoints.length > 0">
      <div class="row justify-content-between">
        <div class="col-12">
          <b-card class="text-center">
            <template #header>
              <div class="row m-0">
                <div class="col-sm-12 col-md-6 d-flex justify-content-start">
                  <h5 class="mb-0">Novos Ponto de Vacinação</h5>
                </div>
                <div class="col-sm-12 col-md-6 d-flex justify-content-end">
                  <b-button variant="success" @click="savePoint">
                    Salvar
                  </b-button>
                </div>
              </div>
            </template>
            <b-table
              id="table-campaign-new-points"
              striped
              responsive
              hover
              :fields="fields"
              :items="newCampaignPoints"
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
                  :url="urlCampaignPoint"
                  text-button="Remover"
                  @deletItem="getDetailSupport"
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
            id="table-campaign-points"
            striped
            responsive
            hover
            small
            :fields="fields"
            :items="campaignPoints"
            primary-key="id"
          >
            <template #cell(id)="data">
              {{ data.item.id }}
            </template>
            <template #cell(name)="data">
              {{ data.item.point.name }}
            </template>
            <template #cell(address)="data">
              {{ data.item.point.address }}
            </template>
            <template #cell(number)="data">
              {{ data.item.point.number }}
            </template>
            <template #cell(point)="data">
              <NuxtLink
                :to="`/ncrlo/campaign/support/point/${data.item.id}`"
                class="btn btn-warning"
              >
                Detalhes
              </NuxtLink>
            </template>
            <template #cell(delete)="data">
              <ModalDelete
                :item="data.item"
                :url="urlCampaignPoint"
                text-button="Remover"
                @deletItem="getDetailSupport"
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
  name: 'SupportDetailsPage',
  data() {
    return {
      support: {},
      campaignPoints: [],
      newCampaignPoints: [],
      url: 'ncrlo/campaign/support/',
      urlCampaignPoint: 'ncrlo/campaign/point',
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
          key: 'point',
          label: 'Ponto',
        },
        {
          key: 'delete',
          label: 'Excluir',
        },
      ],
    };
  },
  created() {
    this.getDetailSupport();
    this.welcomeMessage();
  },
  methods: {
    welcomeMessage() {
      this.$store.commit('layout/CHANGE_NAV_TITLE', 'Pontos de vacinação');
    },
    async getDetailSupport() {
      this.campaignPoints = [];

      const response = await this.$axios.get(
        `${this.url}${this.$route.params.id}`
      );
      this.support = response.data;

      this.support.points.forEach((point) => {
        this.campaignPoints.push(point);
      });
    },
    addPoint(point) {
      this.newCampaignPoints.push({ ...point, _rowVariant: 'success' });
    },
    async savePoint() {
      for (let index = 0; index < this.newCampaignPoints.length; index++) {
        const element = this.newCampaignPoints[index];

        try {
          await this.$axios.post(`${this.urlCampaignPoint}`, {
            ...element,
            campaing_support_id: this.$route.params.id,
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
      this.newCampaignPoints = [];
      this.getDetailSupport();
    },
  },
};
</script>

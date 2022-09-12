<template>
  <main class="container-fluid">
    <div class="row m-2 justify-content-between">
      <div class="col-sm-12 col-md-6">
        <NuxtLink to="/ncrlo/vaccination/point" class="btn btn-success">
          Lista de todos os Postos
        </NuxtLink>
      </div>
      <div class="col-sm-12 col-md-6 d-flex justify-content-end">
        <FormsAddPoint
          text-button="Adicionar Posto"
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
                  <h5 class="mb-0">Novos Postos</h5>
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
              <template #cell(name)="data">
                {{ data.item.name }}
              </template>
              <template #cell(address)="data">
                {{ data.item.address }}
              </template>
              <template #cell(number)="data">
                {{ data.item.number }}
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
            :items="points"
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
            <template #cell(area)="data">
              {{ data.item.area }}
            </template>
            <template #cell(order)="data">
              {{ data.item.order }}
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
            <template #cell(neighborhood)="data">
              {{ data.item.point.neighborhood_alias.name }}
            </template>
            <template #cell(saad)="data">
              <span v-for="saad in data.item.saads" :key="saad.id">
                {{ saad.name }}
              </span>
            </template>
            <template #cell(edit)="data">
              <div class="d-flex">
                <div class="mx-1">
                  <FormsCampaignPoint
                    text-button=""
                    variant="success"
                    :title="data.item.point.name"
                    :old-point="data.item"
                    :supervisors="support.supervisors"
                    :campaign-cycle-id="support.campaign_cycle_id"
                    @update="getDetailSupport"
                  />
                </div>
                <div>
                  <FormsCampaignPointPeople
                    text-button=""
                    variant="info"
                    :title="data.item.point.name"
                    :old-point="data.item"
                    :supervisors="support.supervisors"
                    :campaign-cycle-id="support.campaign_cycle_id"
                    @update="getDetailSupport"
                  />
                </div>
              </div>
            </template>
            <template #cell(delete)="data">
              <ModalDelete
                :item="data.item"
                :url="urlCampaignPoint"
                text-button=""
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
      points: [],
      newCampaignPoints: [],
      url: 'ncrlo/campaign/support/',
      urlCampaignPoint: 'ncrlo/campaign/point/',
      fields: [
        {
          key: 'pendency',
          label: 'Pendência',
          sortable: true,
        },
        {
          key: 'area',
          label: 'Área',
          sortable: true,
        },
        {
          key: 'order',
          label: 'Ordem',
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
          key: 'neighborhood',
          label: 'Bairro',
        },
        {
          key: 'saad',
          label: 'SAAD',
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
    };
  },
  created() {
    this.getDetailSupport();
    this.welcomeMessage();
  },
  methods: {
    welcomeMessage() {
      this.$store.commit('layout/CHANGE_NAV_TITLE', 'Postos');
    },
    async getDetailSupport() {
      this.points = [];

      const response = await this.$axios.get(
        `${this.url}${this.$route.params.id}`
      );
      this.support = response.data;

      this.support.points.forEach((point) => {
        point.pendency = false;
        if (point.supervisor_id === null || point.vaccinators.length === 0) {
          point._rowVariant = 'danger';
          point.pendency = true;
        }
        this.points.push(point);
      });
    },
    addPoint(point) {
      this.newCampaignPoints.push({ ...point, _rowVariant: 'success' });
    },
    savePoint() {
      let counter = 0;
      const i = setInterval(async () => {
        const element = this.newCampaignPoints[counter];
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
        }

        counter++;
        if (counter === this.newCampaignPoints.length) {
          this.newCampaignPoints = [];
          this.getDetailSupport();
          clearInterval(i);
        }
      }, 1000);
    },
  },
};
</script>

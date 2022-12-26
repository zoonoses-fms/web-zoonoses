<template>
  <main class="container-fluid">
    <div class="row m-2 justify-content-between">
      <div class="col-sm-12 col-md-6">
        <NuxtLink to="/ncrlo/vaccination/point" class="btn btn-success">
          Lista de todos os Postos
        </NuxtLink>
      </div>
      <div class="col-sm-12 col-md-6 d-flex justify-content-end">
        <LazyFormsAddPoint
          text-button="Adicionar Posto"
          variant="primary"
          :current-support.sync="support"
          @addSupport="addPoint"
        ></LazyFormsAddPoint>
      </div>
    </div>
    <div v-if="newCampaignPoints.length > 0">
      <div class="row justify-content-between">
        <div class="col-12">
          <BCard class="text-center">
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
            <BTable
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
            </BTable>
          </BCard>
        </div>
      </div>
    </div>
    <div class="row justify-content-between">
      <div class="col-12">
        <BCard>
          <BTable
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
                <b-icon-exclamation-circle
                  v-if="data.item.pendency"
                  variant="danger"
                  font-scale="2"
                ></b-icon-exclamation-circle>
                <b-icon-check-circle
                  v-else
                  variant="success"
                  font-scale="2"
                ></b-icon-check-circle>
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
              <div v-if="data.item.point.neighborhood_alias !== null">
                {{ data.item.point.neighborhood_alias.name }}
              </div>
            </template>
            <template #cell(frequency)="data">
              <b-button
                class="mt-0"
                variant="warning"
                @click="frequencyPdf(data.item)"
              >
                <b-icon-person-badge-fill></b-icon-person-badge-fill>
              </b-button>
            </template>
            <template #cell(edit)="data">
              <div class="d-flex">
                <div class="mx-1">
                  <LazyFormsCampaignPoint
                    text-button=""
                    variant="success"
                    :title="data.item.point.name"
                    :old-point="data.item"
                    :supervisors="support.supervisors"
                    :campaign-cycle-id="support.campaign_cycle_id"
                    @input="feedback"
                  />
                </div>
                <div>
                  <LazyFormsCampaignPointPeople
                    text-button=""
                    variant="info"
                    :cycle="support.cycle"
                    :support="support"
                    :title="data.item.point.name"
                    :old-point="data.item"
                    :supervisors="support.supervisors"
                    :campaign-cycle-id="support.campaign_cycle_id"
                    @input="feedback"
                  />
                </div>
              </div>
            </template>
            <template #cell(delete)="data">
              <LazyModalDelete
                :item="data.item"
                :url="urlCampaignPoint"
                text-button=""
                @deletItem="getDetailSupport"
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
  name: 'SupportDetailsPage',
  mixins: [toast],
  data() {
    return {
      cycle: {
        start: null,
      },
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
          key: 'frequency',
          label: 'Freq.',
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
    feedback(params) {
      this.toast(params);
      this.getDetailSupport();
    },
    async getDetailSupport() {
      this.points = [];

      const response = await this.$axios.get(
        `${this.url}${this.$route.params.id}`
      );
      this.support = response.data;

      this.support.points.forEach((point) => {
        point.pendency = false;
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
           campaign_support_id: this.$route.params.id,
          });
          this.toast({ status: 'success' });
        } catch (errors) {
          this.$emit('input', { status: 'errors', errors });
        }

        counter++;
        if (counter === this.newCampaignPoints.length) {
          this.newCampaignPoints = [];
          this.getDetailSupport();
          clearInterval(i);
        }
      }, 1000);
    },
    async frequencyPdf(point) {
      try {
        const response = await this.$axios.get(
          `${this.urlCampaignPoint}frequency/${point.id}`,
          {
            responseType: 'blob',
          }
        );
        const today = new Date().toISOString().slice(0, 10);
        const blob = new Blob([response.data], { type: 'application/pdf' });
        // const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.target = '_blank';
        link.download = `${today}-Frequência de Locação de Pessoal.pdf`;
        link.click();
      } catch (error) {
        const message =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        console.log(message);
      }
    },
  },
};
</script>

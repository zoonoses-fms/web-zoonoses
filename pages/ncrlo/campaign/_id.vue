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
            <template #cell(description)="data">
              {{ data.item.description }}
            </template>
            <template #cell(start)="data">
              {{ data.item.start }}
            </template>
            <template #cell(points)="data">
              <NuxtLink
                :to="`/ncrlo/campaign/cycle/map/points/${data.item.id}`"
                class="btn btn-success"
              >
                <b-icon icon="map"></b-icon>
              </NuxtLink>
            </template>
            <template #cell(supports)="data">
              <NuxtLink
                :to="`/ncrlo/campaign/cycle/map/supports/${data.item.id}`"
                class="btn btn-info"
              >
                <b-icon icon="map"></b-icon>
              </NuxtLink>
            </template>
            <template #cell(report)="data">
              <b-button
                class="mt-0"
                variant="warning"
                :to="`/ncrlo/campaign/cycle/report/${data.item.id}`"
              >
                <b-icon icon="bar-chart"></b-icon>
              </b-button>
            </template>
            <template #cell(allocation)="data">
              <b-button
                class="mt-0"
                variant="warning"
                @click="allocationPdf(data.item)"
              >
                <b-icon icon="printer"></b-icon>
              </b-button>
            </template>
            <template #cell(frequency)="data">
              <b-button
                class="mt-0"
                variant="warning"
                @click="frequencyPdf(data.item)"
              >
                <b-icon icon="person-badge-fill"></b-icon>
              </b-button>
            </template>
            <template #cell(payroll)="data">
              <b-button
                class="mt-0"
                variant="warning"
                @click="payrollPdf(data.item)"
              >
                <b-icon
                  v-show="loadPayroll.includes(data.item.id)"
                  icon="arrow-clockwise"
                  animation="spin"
                ></b-icon>
                <b-icon v-show="!loadPayroll.includes(data.item.id)" icon="currency-dollar">$</b-icon>
              </b-button>
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
                <b-icon-search></b-icon-search>
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
        year: '',
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
          key: 'description',
          label: 'Descrição',
          sortable: true,
        },
        {
          key: 'start',
          label: 'Início',
          sortable: true,
        },
        {
          key: 'points',
          label: 'Postos',
        },
        {
          key: 'supports',
          label: 'PA',
        },
        {
          key: 'allocation',
          label: 'Aloc.',
        },
        {
          key: 'report',
          label: 'Relat.',
        },
        {
          key: 'frequency',
          label: 'Freq.',
        },
        {
          key: 'payroll',
          label: 'Folha',
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
      loadPayroll: [],
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
    async allocationPdf(cycle) {
      try {
        const response = await this.$axios.get(
          `${this.urlCampaignCycle}allocation/${cycle.id}`,
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
        link.download = `${today}-Relatório de Locação de Pessoal.pdf`;
        link.click();
        // window.open(url);
        // console.log(response);
      } catch (error) {
        const message =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        console.log(message);
      }
    },
    async frequencyPdf(support) {
      try {
        const response = await this.$axios.get(
          `${this.urlCampaignCycle}frequency/${support.id}`,
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
        // window.open(url);
        // console.log(response);
      } catch (error) {
        const message =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        console.log(message);
      }
    },
    async payrollPdf(support) {
      try {
        this.loadPayroll.push(support.id);
        const response = await this.$axios.get(
          `${this.urlCampaignCycle}payroll/${support.id}`,
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
        link.download = `${today}-Folha de pagamento.pdf`;
        link.click();
        // window.open(url);
        // console.log(response);
      } catch (error) {
        const message =
          (error.response && error.response.data) ||
          error.message ||
          error.toString();
        console.log(message);
      }
      this.loadPayroll = this.loadPayroll.filter((value) => {
        return value !== support.id;
      });
      console.log(this.loadPayroll);
    },
  },
};
</script>

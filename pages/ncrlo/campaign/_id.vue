<template>
  <main class="container-fluid">
    <div class="row m-2 justify-content-between">
      <div class="col-sm-12 col-md-6 d-flex justify-content-star"></div>
      <div class="col-sm-12 col-md-6 d-flex justify-content-end">
        <LazyFormsCampaignCycle
          text-button="Cadastrar Etapa"
          variant="primary"
          :current-campaign.sync="campaign"
          @create="getDetailCampaign"
        ></LazyFormsCampaignCycle>
      </div>
    </div>
    <div class="row justify-content-between">
      <div class="col-12">
        <BCard>
          <BTable
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
                <b-icon-map></b-icon-map>
              </NuxtLink>
            </template>
            <template #cell(supports)="data">
              <NuxtLink
                :to="`/ncrlo/campaign/cycle/map/supports/${data.item.id}`"
                class="btn btn-info"
              >
                <b-icon-map></b-icon-map>
              </NuxtLink>
            </template>
            <template #cell(report)="data">
              <b-button
                class="mt-0"
                variant="warning"
                :to="`/ncrlo/campaign/cycle/report/${data.item.id}`"
              >
                <b-icon-bar-chart></b-icon-bar-chart>
              </b-button>
            </template>
            <template #cell(allocation)="data">
              <b-button
                class="mt-0"
                variant="warning"
                @click="allocationPdf(data.item)"
              >
                <b-icon-printer></b-icon-printer>
              </b-button>
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
            <template #cell(payroll)="data">
              <LazyModalExportPayroll
                :item="data.item"
                :url="`${urlCampaignCycle}payroll`"
              ></LazyModalExportPayroll>
            </template>
            <template #cell(edit)="data">
              <LazyFormsCampaignCycle
                text-button=""
                variant="success"
                :old-campaign-cycle="data.item"
                :current-campaign.sync="campaign"
                @input="feedback"
              ></LazyFormsCampaignCycle>
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
              <LazyModalDelete
                :item="data.item"
                :url="urlCampaignCycle"
                text-button=""
                @deletItem="getDetailCampaign"
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
  name: 'CampaignDetailsPage',
  mixins: [toast],
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
    feedback(params) {
      this.toast(params);
      this.getDetailCampaign();
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
    },
  },
};
</script>

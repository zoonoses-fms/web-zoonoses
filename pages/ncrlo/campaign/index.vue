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
            <template #cell(payroll)="data">
              <BSpinner
                v-show="loadPayrollPdf.includes(data.item.id)"
                small
                variant="info"
                label="Spinning"
              ></BSpinner>
              <b-button
                v-show="!loadPayrollPdf.includes(data.item.id)"
                variant="danger"
                @click="payrollPdf(data.item)"
              >
                <b-icon-currency-dollar>$</b-icon-currency-dollar>
              </b-button>
            </template>
            <template #cell(details)="data">
              <NuxtLink
                :to="`/ncrlo/campaign/${data.item.id}`"
                class="btn btn-warning"
              >
                <BIconSearch></BIconSearch>
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
            <template #cell(verification)="data">
              <NuxtLink
                :to="`/ncrlo/campaign/verification/${data.item.id}`"
                class="btn btn-warning"
              >
                <BIconCheckCircle></BIconCheckCircle>
              </NuxtLink>
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
            <template #cell(clone)="data">
              <BButton @click="cloneCampaign(data.item.id)">
                <BIconClipboard />
              </BButton>
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
          key: 'payroll',
          label: 'Folha',
        },
        {
          key: 'edit',
          label: 'Editar',
        },
        {
          key: 'verification',
          label: 'Verif.',
        },
        {
          key: 'delete',
          label: 'Excluir',
        },
        {
          key: 'clone',
          label: 'Clonar',
        },
      ],
      perPage: 10,
      currentPage: 1,
      totalRows: 0,
      search: '',
      rows: [],
      loadPayrollPdf: [],
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
    async payrollPdf(item) {
      try {
        this.loadPayrollPdf.push(item.id);
        const response = await this.$axios.get(
          `${this.url}payroll/pdf/${item.id}`,
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
      this.loadPayrollPdf = this.loadPayrollPdf.filter((value) => {
        return value !== item.id;
      });
    },
    async cloneCampaign(id) {
      await console.log(id);

      try {
        const response = await this.$axios.get(`${this.url}clone/${id}`);
        console.log(response.data);
        this.getRows();
      } catch (error) {
        /* if(error.response.status === 401) {
          this.$router.push('/');
        } */
      }
    },
  },
};
</script>

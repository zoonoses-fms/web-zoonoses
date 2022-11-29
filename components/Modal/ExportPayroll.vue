<template>
  <div>
    <b-button
      v-b-modal="`payroll-modal-${item.id}`"
      class="mt-0"
      variant="danger"
    >
      <b-icon icon="currency-dollar">$</b-icon>
    </b-button>

    <b-modal
      :id="`payroll-modal-${item.id}`"
      title="Exportação Folha de Pagamento"
      hide-footer
    >
      <div class="mx-auto" style="max-width: 180px;">
        <b-button class="mt-0" variant="info" @click="payrollPdf(item)">
          <b-icon
            v-show="loadPayrollPdf.includes(item.id)"
            icon="arrow-clockwise"
            animation="spin"
          ></b-icon>
          <span v-show="!loadPayrollPdf.includes(item.id)">PDF </span>
        </b-button>
        <b-button class="mt-0" variant="info" @click="payrollCsv(item)">
          <b-icon
            v-show="loadPayrollCsv.includes(item.id)"
            icon="arrow-clockwise"
            animation="spin"
          ></b-icon>
          <span v-show="!loadPayrollCsv.includes(item.id)">CSV </span>
        </b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'ModalExportPayroll',
  props: {
    item: {
      type: Object,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loadPayrollPdf: [],
      loadPayrollCsv: [],
    };
  },
  methods: {
    async payrollPdf(item) {
      try {
        this.loadPayrollPdf.push(item.id);
        const response = await this.$axios.get(`${this.url}/pdf/${item.id}`, {
          responseType: 'blob',
        });
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
    async payrollCsv(item) {
      try {
        this.loadPayrollCsv.push(item.id);
        const response = await this.$axios.get(`${this.url}/csv/${item.id}`, {
          responseType: 'blob',
        });
        const today = new Date().toISOString().slice(0, 10);
        const blob = new Blob([response.data], { type: 'text/csv' });
        // const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.target = '_blank';
        link.download = `${today}-Folha de pagamento.csv`;
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
      this.loadPayrollCsv = this.loadPayrollCsv.filter((value) => {
        return value !== item.id;
      });
    },
  },
};
</script>

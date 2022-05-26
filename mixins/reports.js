export default {
  data() {
    return {};
  },
  methods: {
    async reportPdf() {
      this.perPage = 100000;
      try {
        const response = await this.$axios.get(`${this.url}pdf/`, {
          params: this.params,
          responseType: 'blob',
        });
        const today = new Date().toISOString().slice(0, 10);
        const blob = new Blob([response.data], { type: 'application/pdf' });
        // const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.target = '_blank';
        link.download = `${today}-relatório-${this.module}.pdf`;
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
      this.perPage = 10;
    },
    async reportByHealthUnitPdf(healthUnit) {
      this.perPage = 100000;
      try {
        const response = await this.$axios.get(
          `${this.url}health_unit/${healthUnit.cnes_code}/pdf/`,
          {
            params: this.params,
            responseType: 'blob',
          }
        );
        const today = new Date().toISOString().slice(0, 10);
        const blob = new Blob([response.data], { type: 'application/pdf' });
        // const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.target = '_blank';
        link.download = `${today}-relatório-de-acompanhamento-${this.module}.pdf`;
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
      this.perPage = 10;
    },
  },
};

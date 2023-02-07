<template>
  <div>
    <b-button v-b-modal="`frequecy-modal-${item.id}`" class="mt-0" variant="danger">
      <b-icon-person-badge-fill></b-icon-person-badge-fill>
    </b-button>

    <b-modal
      :id="`frequecy-modal-${item.id}`"
      title="Frequência"
      hide-footer
    >
      <div class="mx-auto" style="max-width: 480px">
        <b-button class="m-1" variant="info" @click="frequencyPdf(item)">
          <BSpinner
            v-show="loadFrequencyPdf.includes(item.id)"
            small
            variant="info"
            label="Spinning"
          ></BSpinner>
          <span v-show="!loadFrequencyPdf.includes(item.id)">Frequência do PA</span>
        </b-button>
        <b-button class="m-1" variant="success" @click="frequencyBySupervisorPdf(item)">
          <BSpinner
            v-show="loadFrequencyBySupervisorPdf.includes(item.id)"
            small
            variant="success"
            label="Spinning"
          ></BSpinner>
          <span v-show="!loadFrequencyBySupervisorPdf.includes(item.id)">Frequência dos Posto por supervisor</span>
        </b-button>

      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "ModalExportPayroll",
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
      loadFrequencyPdf: [],
      loadFrequencyBySupervisorPdf: [],
    };
  },
  methods: {
    async frequencyPdf(item) {
      try {
        this.loadFrequencyPdf.push(item.id);
        const response = await this.$axios.get(`${this.url}pdf/${item.id}`, {
          responseType: "blob",
        });
        const today = new Date().toISOString().slice(0, 10);
        const blob = new Blob([response.data], { type: "application/pdf" });
        // const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.target = "_blank";
        link.download = `${today}-Frequência PA.pdf`;
        link.click();
        // window.open(url);
        // console.log(response);
      } catch (error) {
        const message =
          (error.response && error.response.data) || error.message || error.toString();
        console.log(message);
      }
      this.loadFrequencyPdf = this.loadFrequencyPdf.filter((value) => {
        return value !== item.id;
      });
    },
    async frequencyBySupervisorPdf(item) {
      try {
        this.loadFrequencyBySupervisorPdf.push(item.id);
        const response = await this.$axios.get(`${this.url}supervisor/pdf/${item.id}`, {
          responseType: "blob",
        });
        const today = new Date().toISOString().slice(0, 10);
        const blob = new Blob([response.data], { type: "application/pdf" });
        // const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.target = "_blank";
        link.download = `${today}-Frequência Postos.pdf`;
        link.click();
        // window.open(url);
        // console.log(response);
      } catch (error) {
        const message =
          (error.response && error.response.data) || error.message || error.toString();
        console.log(message);
      }
      this.loadFrequencyBySupervisorPdf = this.loadFrequencyBySupervisorPdf.filter((value) => {
        return value !== item.id;
      });
    },
  },
};
</script>

<template>
  <main v-if="cycle" class="container-fluid">
    <div class="row m-2 justify-content-between">
      <b-card class="col-12">
        <template #header>
          <h5 class="mb-0">{{ cycle.description }}</h5>
          <h6 class="mb-0">
            {{ cycle.start }} {{ cycle.end != null ? ' - ' + cycle.end : '' }}
          </h6>
          <NuxtLink
            :to="`/ncrlo/campaign/cycle/report/details/${cycle.id}`"
            class="btn btn-warning"
          >
            Faixa Etária de Cachorros
          </NuxtLink>
          <b-button class="mt-0" variant="warning" @click="reportPdf(cycle)">
            <b-icon icon="printer"></b-icon>
          </b-button>
        </template>
      </b-card>
    </div>
    <div class="row m-2 justify-content-between">
      <b-card class="col-12">
        <template #header>
          <h5 class="mb-0">{{ cycle.description }}</h5>
        </template>
        <b-table
          striped
          responsive
          hover
          small
          sticky-header
          :fields="consolidatedFields"
          :items="[cycle]"
          bordered
        >
          <template #thead-top> </template>
        </b-table>
      </b-card>
    </div>
    <div
      v-for="support in cycle.supports"
      :key="support.id"
      class="row m-2 justify-content-between"
    >
      <b-card class="col-12">
        <template #header>
          <h5 class="mb-0">{{ support.support.name }}</h5>
        </template>

        <b-table
          striped
          responsive
          hover
          small
          sticky-header
          :fields="consolidatedFields"
          :items="[support]"
          bordered
        >
          <template #thead-top> </template>
        </b-table>

        <b-table
          striped
          responsive
          hover
          small
          sticky-header
          :fields="fields"
          :items="support.points"
          bordered
        >
          <template #thead-top> </template>
        </b-table>
      </b-card>
    </div>
  </main>
</template>

<script>
export default {
  name: 'CampaignReport',
  data() {
    return {
      url: 'ncrlo/campaign/cycle/report/',
      cycle: null,
      fields: [
        { key: 'point.name', label: 'Nome', sortable: true },
        { key: 'male_dogs', label: 'Cães', sortable: true },
        { key: 'female_dogs', label: 'Cadelas', sortable: true },
        { key: 'total_of_dogs', label: 'Total Cães', sortable: true },
        { key: 'male_cat', label: 'Gatos', sortable: true },
        { key: 'female_cat', label: 'Gatas', sortable: true },
        { key: 'total_of_cats', label: 'Total Gatos', sortable: true },
        { key: 'total', label: 'Total', sortable: true },
      ],
      consolidatedFields: [
        { key: 'male_dogs', label: 'Cães', sortable: true },
        { key: 'female_dogs', label: 'Cadelas', sortable: true },
        { key: 'total_of_dogs', label: 'Total Cães', sortable: true },
        { key: 'male_cat', label: 'Gatos', sortable: true },
        { key: 'female_cat', label: 'Gatas', sortable: true },
        { key: 'total_of_cats', label: 'Total Gatos', sortable: true },
        { key: 'total', label: 'Total', sortable: true },
      ],
    };
  },
  created() {
    this.getReport();
  },
  methods: {
    async getReport() {
      const response = await this.$axios.get(
        `${this.url}${this.$route.params.id}`
      );
      this.cycle = response.data;
    },
    async reportPdf(support) {
      try {
        const response = await this.$axios.get(`${this.url}pdf/${support.id}`, {
          responseType: 'blob',
        });
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
  },
};
</script>

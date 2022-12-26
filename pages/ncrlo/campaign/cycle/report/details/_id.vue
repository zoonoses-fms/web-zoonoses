<template>
  <main v-if="cycle" class="container-fluid">
    <div class="row m-2 justify-content-between">
      <BCard class="col-12">
        <template #header>
          <h5 class="mb-0">{{ cycle.description }}</h5>
          <h6 class="mb-0">
            {{ cycle.start }} {{ cycle.end != null ? ' - ' + cycle.end : '' }}
          </h6>
          <b-button class="mt-0" variant="warning" @click="reportPdf(cycle)">
            <b-icon-printer></b-icon-printer>
          </b-button>
        </template>
      </BCard>
    </div>
    <div class="row m-2 justify-content-between">
      <BCard class="col-12">
        <template #header>
          <h5 class="mb-0">{{ cycle.description }}</h5>
        </template>
        <BTable
          striped
          responsive
          hover
          small
          sticky-header
          :fields="consolidatedFields"
          :items="[cycle]"
          bordered
          class="details"
        >
          <template #thead-top>
            <b-tr>
              <b-th variant="info" colspan="6">Cão</b-th>
              <b-th variant="danger" colspan="6">Cadela</b-th>
              <b-th variant="warning">Total</b-th>
            </b-tr>
          </template>
        </BTable>
      </BCard>
    </div>
    <div
      v-for="support in cycle.supports"
      :key="support.id"
      class="row m-2 justify-content-between"
    >
      <BCard class="col-12">
        <template #header>
          <h5 class="mb-0">{{ support.support.name }}</h5>
        </template>

        <BTable
          striped
          responsive
          hover
          small
          sticky-header
          :fields="consolidatedFields"
          :items="[support]"
          bordered
          class="details"
        >
          <template #thead-top>
            <b-tr>
              <b-th variant="info" colspan="6">Cão</b-th>
              <b-th variant="danger" colspan="6">Cadela</b-th>
              <b-th variant="warning">Total</b-th>
            </b-tr>
          </template>
        </BTable>

        <BTable
          striped
          responsive
          hover
          small
          sticky-header
          :fields="fields"
          :items="support.points"
          bordered
          class="details"
        >
          <template #thead-top>
            <b-tr>
              <b-th></b-th>
              <b-th variant="info" colspan="6">Cão</b-th>
              <b-th variant="danger" colspan="6">Cadela</b-th>
              <b-th variant="warning">Total</b-th>
            </b-tr>
          </template>
        </BTable>
      </BCard>
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
        { key: 'male_dog_under_4m', label: '<4M', sortable: true },
        { key: 'male_dog_major_4m_under_1y', label: '4M-<1A', sortable: true },
        { key: 'male_dog_major_1y_under_2y', label: '1A-<2A', sortable: true },
        { key: 'male_dog_major_2y_under_4y', label: '2A-<4A', sortable: true },
        { key: 'male_dog_major_4y', label: '>4A', sortable: true },
        { key: 'male_dogs', label: 'Total', sortable: true },
        { key: 'female_dog_under_4m', label: '< 4M', sortable: true },
        {
          key: 'female_dog_major_4m_under_1y',
          label: '4M-<1A',
          sortable: true,
        },
        {
          key: 'female_dog_major_1y_under_2y',
          label: '1A-<2A',
          sortable: true,
        },
        {
          key: 'female_dog_major_2y_under_4y',
          label: '2A-<4A',
          sortable: true,
        },
        { key: 'female_dog_major_4y', label: '>4A', sortable: true },
        { key: 'female_dogs', label: 'Total', sortable: true },
        { key: 'total_of_dogs', label: 'Total', sortable: true },
      ],

      consolidatedFields: [
        { key: 'male_dog_under_4m', label: '<4M', sortable: true },
        { key: 'male_dog_major_4m_under_1y', label: '4M-<1A', sortable: true },
        { key: 'male_dog_major_1y_under_2y', label: '1A-<2A', sortable: true },
        { key: 'male_dog_major_2y_under_4y', label: '2A-<4A', sortable: true },
        { key: 'male_dog_major_4y', label: '>4A', sortable: true },
        { key: 'male_dogs', label: 'Total', sortable: true },
        { key: 'female_dog_under_4m', label: '< 4M', sortable: true },
        {
          key: 'female_dog_major_4m_under_1y',
          label: '4M-<1A',
          sortable: true,
        },
        {
          key: 'female_dog_major_1y_under_2y',
          label: '1A-<2A',
          sortable: true,
        },
        {
          key: 'female_dog_major_2y_under_4y',
          label: '2A-<4A',
          sortable: true,
        },
        { key: 'female_dog_major_4y', label: '>4A', sortable: true },
        { key: 'female_dogs', label: 'Total', sortable: true },
        { key: 'total_of_dogs', label: 'Total', sortable: true },
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
        const response = await this.$axios.get(
          `${this.url}pdf/${support.id}?details=true`,
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
        link.download = `${today}-Relatório de vacinação.pdf`;
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
<style scoped>
.details {
  font-size: 12px;
}
</style>

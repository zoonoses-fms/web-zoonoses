<template>
  <main class="container-fluid">
    {{ $route.params }}
    <div class="row m-2 justify-content-between"></div>
    <div class="row justify-content-between"></div>
  </main>
</template>

<script>
export default {
  name: 'VaccinationSupportPointPage',
  data() {
    return {
      listSupportPoint: [],
      listVaccinationSupportPoint: [],
      campaign: {
        perPage: 10,
        currentPage: 1,
        totalRows: 0,
        search: '',
        rows: [],
        url: 'ncrlo/campaign/support',
      },
      vaccination: {
        perPage: 10,
        currentPage: 1,
        totalRows: 0,
        search: '',
        rows: [],
        url: 'ncrlo/vaccination/support',
      },
    };
  },

  created() {
    this.getRows();
    this.welcomeMessage();
  },
  methods: {
    welcomeMessage() {
      this.$store.commit(
        'layout/CHANGE_NAV_TITLE',
        'Pontos de apoi a campanhas de vacinação'
      );
    },
    async getRows() {
      try {
        const response = await this.$axios.get(`${this.campaign.url}`, {
          params: {
            per_page: this.perPage,
            page: this.currentPage,
          },
        });
        this.campaign.rows = await response.data.data;
        this.campaign.totalRows = await response.data.total;
      } catch (error) {
        /* if(error.response.status === 401) {
          this.$router.push('/');
        } */
      }
    },
  },
};
</script>

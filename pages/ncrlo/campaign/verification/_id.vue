<template>
  <div>
    <BCard v-for="cycle in cycles" :key="cycle.id">
      <BButton v-b-toggle="`collapse-${cycle.id}`" variant="primary" block>
        {{ cycle.description }} - {{ cycle.start }}
      </BButton>
      <BCollapse :id="`collapse-${cycle.id}`" class="mt-2">
        <TablesProfilesWorkers
          v-if="!cycle.loading"
          :cycle="cycle"
        ></TablesProfilesWorkers>
      </BCollapse>
    </BCard>
  </div>
</template>

<script>
export default {
  name: 'CampaignVerificationPage',
  data() {
    return {
      campaign: {
        year: '',
      },
      cycles: [],
      url: 'ncrlo/campaign/',
      urlCampaignCycle: 'ncrlo/campaign/cycle/',
    };
  },
  created() {
    this.getDetailCampaign();
  },
  methods: {
    welcomeMessage() {
      this.$store.commit(
        'layout/CHANGE_NAV_TITLE',
        `Verificação de alocação e presença ${this.campaign.year}`
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
      this.welcomeMessage();
    },
  },
};
</script>

<style lang="scss" scoped></style>

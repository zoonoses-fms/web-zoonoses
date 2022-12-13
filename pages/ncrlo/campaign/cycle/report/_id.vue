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
            Faixa Etária de Canino
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
          class="table"
        >
          <template #thead-top> </template>
          <template #cell(male_dogs)="data">
            {{ data.item.male_dogs.toLocaleString('pt-BR') }}
          </template>
          <template #cell(percentage_male_dogs)="data">
            {{ calcPercentage(data.item.male_dogs, data.item.total_of_dogs) }}
          </template>
          <template #cell(female_dogs)="data">
            {{ data.item.female_dogs.toLocaleString('pt-BR') }}
          </template>
          <template #cell(percentage_female_dogs)="data">
            {{ calcPercentage(data.item.female_dogs, data.item.total_of_dogs) }}
          </template>
          <template #cell(total_of_dogs)="data">
            {{ data.item.total_of_dogs.toLocaleString('pt-BR') }}
          </template>
          <template #cell(percentage_total_of_dogs)="data">
            {{ calcPercentage(data.item.total_of_dogs, data.item.total) }}
          </template>
          <template #cell(male_cat)="data">
            {{ data.item.male_cat.toLocaleString('pt-BR') }}
          </template>
          <template #cell(percentage_male_cat)="data">
            {{ calcPercentage(data.item.male_cat, data.item.total_of_cats) }}
          </template>
          <template #cell(female_cat)="data">
            {{ data.item.female_cat.toLocaleString('pt-BR') }}
          </template>
          <template #cell(percentage_female_cat)="data">
            {{ calcPercentage(data.item.female_cat, data.item.total_of_cats) }}
          </template>
          <template #cell(total_of_cats)="data">
            {{ data.item.total_of_cats.toLocaleString('pt-BR') }}
          </template>
          <template #cell(percentage_total_of_cats)="data">
            {{ calcPercentage(data.item.total_of_cats, data.item.total) }}
          </template>
          <template #cell(total)="data">
            {{ data.item.total.toLocaleString('pt-BR') }}
          </template>
          <template #cell(goal)="data">
            {{ data.item.goal.toLocaleString('pt-BR') }}
          </template>
          <template #cell(calcGoal)="data">
            {{ calcGoal(data.item) }}
          </template>
        </b-table>
        <b-table
          striped
          responsive
          hover
          small
          sticky-header
          :fields="saadFields"
          :items="Object.keys(cycle.saads).map((key) => cycle.saads[key])"
          bordered
          class="table"
        >
          <template #thead-top> </template>
          <template #cell(male_dogs)="data">
            {{ data.item.male_dogs.toLocaleString('pt-BR') }}
          </template>
          <template #cell(percentage_male_dogs)="data">
            {{ calcPercentage(data.item.male_dogs, data.item.total_of_dogs) }}
          </template>
          <template #cell(female_dogs)="data">
            {{ data.item.female_dogs.toLocaleString('pt-BR') }}
          </template>
          <template #cell(percentage_female_dogs)="data">
            {{ calcPercentage(data.item.female_dogs, data.item.total_of_dogs) }}
          </template>
          <template #cell(total_of_dogs)="data">
            {{ data.item.total_of_dogs.toLocaleString('pt-BR') }}
          </template>
          <template #cell(percentage_total_of_dogs)="data">
            {{ calcPercentage(data.item.total_of_dogs, data.item.total) }}
          </template>
          <template #cell(male_cat)="data">
            {{ data.item.male_cat.toLocaleString('pt-BR') }}
          </template>
          <template #cell(percentage_male_cat)="data">
            {{ calcPercentage(data.item.male_cat, data.item.total_of_cats) }}
          </template>
          <template #cell(female_cat)="data">
            {{ data.item.female_cat.toLocaleString('pt-BR') }}
          </template>
          <template #cell(percentage_female_cat)="data">
            {{ calcPercentage(data.item.female_cat, data.item.total_of_cats) }}
          </template>
          <template #cell(total_of_cats)="data">
            {{ data.item.total_of_cats.toLocaleString('pt-BR') }}
          </template>
          <template #cell(percentage_total_of_cats)="data">
            {{ calcPercentage(data.item.total_of_cats, data.item.total) }}
          </template>
          <template #cell(total)="data">
            {{ data.item.total.toLocaleString('pt-BR') }}
          </template>
          <template #cell(goal)="data">
            {{ data.item.goal.toLocaleString('pt-BR') }}
          </template>
          <template #cell(calcGoal)="data">
            {{ calcGoal(data.item) }}
          </template>
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
          <h5 class="mb-0">
            {{ support.support.name }} - {{ support.saads[0].name }}
          </h5>
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
          class="table"
        >
          <template #thead-top> </template>
          <template #cell(male_dogs)="data">
            {{ data.item.male_dogs.toLocaleString('pt-BR') }}
          </template>
          <template #cell(percentage_male_dogs)="data">
            {{ calcPercentage(data.item.male_dogs, data.item.total_of_dogs) }}
          </template>
          <template #cell(female_dogs)="data">
            {{ data.item.female_dogs.toLocaleString('pt-BR') }}
          </template>
          <template #cell(percentage_female_dogs)="data">
            {{ calcPercentage(data.item.female_dogs, data.item.total_of_dogs) }}
          </template>
          <template #cell(total_of_dogs)="data">
            {{ data.item.total_of_dogs.toLocaleString('pt-BR') }}
          </template>
          <template #cell(percentage_total_of_dogs)="data">
            {{ calcPercentage(data.item.total_of_dogs, data.item.total) }}
          </template>
          <template #cell(male_cat)="data">
            {{ data.item.male_cat.toLocaleString('pt-BR') }}
          </template>
          <template #cell(percentage_male_cat)="data">
            {{ calcPercentage(data.item.male_cat, data.item.total_of_cats) }}
          </template>
          <template #cell(female_cat)="data">
            {{ data.item.female_cat.toLocaleString('pt-BR') }}
          </template>
          <template #cell(percentage_female_cat)="data">
            {{ calcPercentage(data.item.female_cat, data.item.total_of_cats) }}
          </template>
          <template #cell(total_of_cats)="data">
            {{ data.item.total_of_cats.toLocaleString('pt-BR') }}
          </template>
          <template #cell(percentage_total_of_cats)="data">
            {{ calcPercentage(data.item.total_of_cats, data.item.total) }}
          </template>
          <template #cell(total)="data">
            {{ data.item.total.toLocaleString('pt-BR') }}
          </template>
          <template #cell(goal)="data">
            {{ data.item.goal.toLocaleString('pt-BR') }}
          </template>
          <template #cell(calcGoal)="data">
            {{ calcGoal(data.item) }}
          </template>
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
          class="table"
        >
          <template #thead-top> </template>
          <template #cell(male_dogs)="data">
            {{ data.item.male_dogs.toLocaleString('pt-BR') }}
          </template>
          <template #cell(percentage_male_dogs)="data">
            {{ calcPercentage(data.item.male_dogs, data.item.total_of_dogs) }}
          </template>
          <template #cell(female_dogs)="data">
            {{ data.item.female_dogs.toLocaleString('pt-BR') }}
          </template>
          <template #cell(percentage_female_dogs)="data">
            {{ calcPercentage(data.item.female_dogs, data.item.total_of_dogs) }}
          </template>
          <template #cell(total_of_dogs)="data">
            {{ data.item.total_of_dogs.toLocaleString('pt-BR') }}
          </template>
          <template #cell(percentage_total_of_dogs)="data">
            {{ calcPercentage(data.item.total_of_dogs, data.item.total) }}
          </template>
          <template #cell(male_cat)="data">
            {{ data.item.male_cat.toLocaleString('pt-BR') }}
          </template>
          <template #cell(percentage_male_cat)="data">
            {{ calcPercentage(data.item.male_cat, data.item.total_of_cats) }}
          </template>
          <template #cell(female_cat)="data">
            {{ data.item.female_cat.toLocaleString('pt-BR') }}
          </template>
          <template #cell(percentage_female_cat)="data">
            {{ calcPercentage(data.item.female_cat, data.item.total_of_cats) }}
          </template>
          <template #cell(total_of_cats)="data">
            {{ data.item.total_of_cats.toLocaleString('pt-BR') }}
          </template>
          <template #cell(percentage_total_of_cats)="data">
            {{ calcPercentage(data.item.total_of_cats, data.item.total) }}
          </template>
          <template #cell(total)="data">
            {{ data.item.total.toLocaleString('pt-BR') }}
          </template>
          <template #cell(goal)="data">
            {{ data.item.goal.toLocaleString('pt-BR') }}
          </template>
          <template #cell(calcGoal)="data">
            {{ calcGoal(data.item) }}
          </template>
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
        { key: 'male_dogs', label: 'Cães', sortable: false },
        { key: 'percentage_male_dogs', label: '% Cães', sortable: false },
        { key: 'female_dogs', label: 'Cadelas', sortable: false },
        { key: 'percentage_female_dogs', label: '% Cadelas', sortable: false },
        { key: 'total_of_dogs', label: 'Total Cães', sortable: false },
        {
          key: 'percentage_total_of_dogs',
          label: '% Total Cães',
          sortable: false,
        },
        { key: 'male_cat', label: 'Gatos', sortable: false },
        { key: 'percentage_male_cat', label: '% Gatos', sortable: false },
        { key: 'female_cat', label: 'Gatas', sortable: false },
        { key: 'percentage_female_cat', label: '% Gatas', sortable: false },
        { key: 'total_of_cats', label: 'Total Gatos', sortable: false },
        {
          key: 'percentage_total_of_cats',
          label: '% Total Gatos',
          sortable: false,
        },
        { key: 'total', label: 'Total', sortable: false },
        { key: 'goal', label: 'Meta', sortable: false },
        { key: 'calcGoal', label: 'Cobertura', sortable: false },
      ],
      saadFields: [
        { key: 'name', label: 'Nome', sortable: true },
        { key: 'male_dogs', label: 'Cães', sortable: false },
        { key: 'percentage_male_dogs', label: '% Cães', sortable: false },
        { key: 'female_dogs', label: 'Cadelas', sortable: false },
        { key: 'percentage_female_dogs', label: '% Cadelas', sortable: false },
        { key: 'total_of_dogs', label: 'Total Cães', sortable: false },
        {
          key: 'percentage_total_of_dogs',
          label: '% Total Cães',
          sortable: false,
        },
        { key: 'male_cat', label: 'Gatos', sortable: false },
        { key: 'percentage_male_cat', label: '% Gatos', sortable: false },
        { key: 'female_cat', label: 'Gatas', sortable: false },
        { key: 'percentage_female_cat', label: '% Gatas', sortable: false },
        { key: 'total_of_cats', label: 'Total Gatos', sortable: false },
        {
          key: 'percentage_total_of_cats',
          label: '% Total Gatos',
          sortable: false,
        },
        { key: 'total', label: 'Total', sortable: false },
        { key: 'goal', label: 'Meta', sortable: false },
        { key: 'calcGoal', label: 'Cobertura', sortable: false },
      ],
      consolidatedFields: [
        { key: 'male_dogs', label: 'Cães', sortable: false },
        { key: 'percentage_male_dogs', label: '% Cães', sortable: false },
        { key: 'female_dogs', label: 'Cadelas', sortable: false },
        { key: 'percentage_female_dogs', label: '% Cadelas', sortable: false },
        { key: 'total_of_dogs', label: 'Total Cães', sortable: false },
        {
          key: 'percentage_total_of_dogs',
          label: '% Total Cães',
          sortable: false,
        },
        { key: 'male_cat', label: 'Gatos', sortable: false },
        { key: 'percentage_male_cat', label: '% Gatos', sortable: false },
        { key: 'female_cat', label: 'Gatas', sortable: false },
        { key: 'percentage_female_cat', label: '% Gatas', sortable: false },
        { key: 'total_of_cats', label: 'Total Gatos', sortable: false },
        {
          key: 'percentage_total_of_cats',
          label: '% Total Gatos',
          sortable: false,
        },
        { key: 'total', label: 'Total', sortable: false },
        { key: 'goal', label: 'Meta', sortable: false },
        { key: 'calcGoal', label: 'Cobertura', sortable: false },
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

      const saads = Object.keys(this.cycle.saads).map(
        (key) => this.cycle.saads[key]
      );
      console.log(saads);
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
    calcGoal(item) {
      if (item.total > 0 && item.goal) {
        const percent = item.total / (item.goal / 100);
        return `${percent.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}%`;
      } else {
        return '0%';
      }
    },
    calcPercentage(part, total) {
      const one = total / 100;
      const percentage = part / one;

      return `${percentage.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}%`;
    },
  },
};
</script>
<style scoped>
.table {
  font-size: 12px;
}
</style>

<template>
  <div class="card text-center shadow m-2">
    <div class="card-body pl-2 pr-1 py-1">
      <BTable striped hover :items="series" :fields="fields"></BTable>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableCases',
  props: {
    title: {
      type: String,
      default: '',
    },
    url: {
      type: String,
      required: true,
    },
    params: {
      type: Object,
      default: null,
    },
    id: {
      type: String,
      default: null,
    },
    locationName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      series: [],
      localParams: {},
      perPage: 100,
      currentPage: 1,
      total: 0,
      fields: [
        {
          key: 'nm_bairro',
          label: 'Nome',
          sortable: true,
        },
        {
          key: 'count',
          label: 'Casos',
          sortable: true,
        },
      ],
    };
  },
  watch: {
    deep: true,
    immediate: true,
    id() {
      this.getSerie(this.url, this.params);
    },
    params(val) {
      this.localParams = { ...val };
      this.localParams.per_page = this.perPage;
      this.localParams.page = this.currentPage;
      this.getSerie(this.url, this.localParams);
    },
  },
  mounted() {
    if (this.id != null) {
      this.localParams = { ...this.params };
      this.getSerie(this.url, this.localParams);
    }
  },
  methods: {
    setPage(page) {
      this.currentPage = page;
      this.localParams.per_page =
        this.params.per_page === undefined
          ? this.perPage
          : this.params.per_page;
      this.localParams.page = this.currentPage;
      this.getSerie(this.url, this.localParams);
    },
    async getSerie(url, params) {
      const result = await this.$axios.get(`${url}/${this.id}/`, {
        params,
      });
      result.data.data.forEach((item) => {
        this.series.push(item);
      });

      this.total = await result.data.total;
      this.$emit('change', result.data.data);
    },
  },
};
</script>

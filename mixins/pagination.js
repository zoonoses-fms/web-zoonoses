export default {
  data() {
    return {};
  },
  computed: {
    params() {
      let params = {};
      params = this.genPage(params);
      params = this.genSearch(params);
      params = this.genFilterDate(params);
      return params;
    },
  },
  methods: {
    genPage(params) {
      params.per_page = this.perPage;
      params.page = this.currentPage;

      return params;
    },
    genSearch(params) {
      if (this.search.length > 3) {
        params.search = this.search;
      } else if (params.search !== null) {
        delete params.search;
      }
      return params;
    },
    genFilterDate(params) {
      if (this.searchDate.start != null && this.searchDate.end != null) {
        const start = new Date(this.searchDate.start);
        const end = new Date(this.searchDate.end);
        if (start > end) {
          this.notifyVue(
            'top',
            'center',
            'Data inicial maior que data final!',
            'success'
          );
          return params;
        }
        params.start = this.searchDate.start;
        params.end = this.searchDate.end;
      }
      return params;
    },
  },
};

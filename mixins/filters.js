export default {
  data() {
    return {};
  },
  computed: {},
  methods: {
    setFiltersLocation(params, store) {
      params.is_resident = this.$store.state[store].isResident;
      return params;
    },
    setFiltersCids(params, store, column) {
      if (params.column_filters !== undefined) {
        delete params.column_filter_in;
        delete params.term_filters_in;
      }

      if (params.column_filter_or_range !== undefined) {
        delete params.column_filter_or_range;
        delete params.term_filter_or_range;
      }

      if (this.$store.state[store].filter_cids != null) {
        params.column_filter_in = column;
        params.term_filters_in = this.$store.state[store].filter_cids;
      }

      if (this.$store.state[store].filter_groups_cids != null) {
        params.column_filter_or_range = [column];
        params.term_filter_or_range =
          this.$store.state[store].filter_groups_cids;
      }

      if (this.$store.state[store].filter_chapters_cids != null) {
        params.column_filter_or_range = [column];
        params.term_filter_or_range =
          this.$store.state[store].filter_chapters_cids;
      }

      return params;
    },
    resetFilters() {
      this.$store.commit(`${this.module}/setResident`, {
        isResident: true,
      });
    },
    changeLocationFilter(locationFilter) {
      this.name = locationFilter.locationName;
      this.locationName = locationFilter.locationName;
      this.setAllFilters();
    },
    setFilter(params, columnFilter, termFilter, operatorFilter = '=') {
      if (params.column_filter === undefined) {
        params.column_filter = [];
        params.term_filter = [];
        params.operator_filter = [];
      }
      params.column_filter.push(columnFilter);
      params.term_filter.push(termFilter);
      params.operator_filter.push(operatorFilter);

      return params;
    },
  },
};

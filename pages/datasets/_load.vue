<template>
  <div class="row">
    <div class="col-12">
      <LazyInputUploadFile
        resource="dataset"
        :source="source"
        :system="system"
        :initial="initial"
        @upload="upload"
      >
        <template #table>
          <BCard class="text-center">
            <BTable
              id="table-born-alive-form"
              striped
              hover
              :fields="fields"
              :items="rows"
              :busy="isBusy"
              primary-key="id"
            >
              <template #cell(id)="data">
                {{ data.item.id }}
              </template>
              <template #cell(year)="data">
                {{ data.item.year }}
              </template>
              <template #cell(source)="data">
                {{ data.item.source }}
              </template>
              <template #cell(color)="data">
                <v-swatches
                  v-model="data.item.color"
                  :wrapper-style="grid"
                  :swatch-style="iconColor"
                  :trigger-style="iconColor"
                  :swatches="swatches"
                  @input="changeColor($event, row[keyColumns])"
                ></v-swatches>
              </template>
              <template #cell(updated_at)="data">
                {{ data.item.updated_at | formatDateTime }}
              </template>
            </BTable>
          </BCard>
          <div class="row">
            <div class="col-sm-12 col-md-8">
              <b-pagination
                v-model="currentPage"
                :total-rows="totalRows"
                :per-page="perPage"
                limit="8"
                class="pagination-danger"
                @input="getRows"
              ></b-pagination>
            </div>
            <div class="col-sm-12 col-md-2">
              <b-form-select
                v-model="perPage"
                :options="perPageOptions"
                @change="getRows"
              ></b-form-select>
            </div>
          </div>
        </template>
      </LazyInputUploadFile>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
export default {
  name: 'LoadDatasets',
  data() {
    return {
      isBusy: false,
      rows: [],
      source: '',
      system: '',
      initial: '',
      fields: [
        { key: 'id', label: 'Id', sortable: true },
        { key: 'year', label: 'Ano', sortable: true },
        { key: 'source', label: 'Fonte', sortable: true },
        { key: 'color', label: 'Cor', sortable: true },
        { key: 'updated_at', label: 'Update', sortable: true },
      ],
      grid: {
        display: 'grid',
        'grid-template-columns': 'repeat(4, 1fr)',
        'overflow-y': 'auto',
        height: '250px',
      },
      iconColor: { width: '28px', height: '28px' },
      swatches: [
        ...Vue.palette.metro,
        ...Vue.palette.field,
        ...Vue.palette.nights,
        ...Vue.palette.pastels,
        ...Vue.palette.brewer1,
        ...Vue.palette.brewer2,
      ],

      perPage: 10,
      currentPage: 1,
      totalRows: 0,
      perPageOptions: [5, 10, 50, 100],
      urlBase: '',
    };
  },
  create() {},
  computed: {
    loggedIn() {
      return this.$store.state.auth.loggedIn;
    },
    isSuperuser() {
      if (this.$store.state.auth.user.is_superuser) {
        return true;
      } else {
        return false;
      }
    },
    params() {
      const params = {
        per_page: this.perPage,
        page: this.currentPage,
      };
      return params;
    },
  },
  beforeMount() {
    this.source = this.$route.params.source;
    this.system = this.$route.params.system;
    this.initial = this.$route.params.initial;
    this.urlBase = `dataset/${this.source}/${this.system}/${this.initial}`;
  },
  mounted() {
    this.getRows();
  },
  methods: {
    upload() {
      // this.$refs.table.getRows();
      this.getRows();
    },
    async getRows() {
      this.isBusy = !this.isBusy;
      const response = await this.$axios.get(this.urlBase, {
        params: this.params,
      });
      this.rows = await response.data.data;
      this.totalRows = await response.data.total;
      this.isBusy = !this.isBusy;
    },
    genPage() {
      return `?per_page=${this.perPage}&page=${this.currentPage}`;
    },
  },
};
</script>

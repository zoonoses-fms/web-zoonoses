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
            <BOverlay :show="show">
              <BTable
                id="table-born-alive-form"
                striped
                hover
                :fields="fields"
                :items="rows"
                :busy="isBusy"
                primary-key="id"
                select-mode="single"
                selectable
                @row-selected="onRowSelected"
              >
                <template #cell(selected)="{ rowSelected }">
                  <template v-if="rowSelected">
                    <span aria-hidden="true">&check;</span>
                    <span class="sr-only">Selected</span>
                  </template>
                  <template v-else>
                    <span aria-hidden="true">&nbsp;</span>
                    <span class="sr-only">Not selected</span>
                  </template>
                </template>
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
                    @input="changeColor($event, data.item.id)"
                  ></v-swatches>
                </template>
                <template #cell(delete)="data">
                  <LazyModalDelete
                    :item="data.item"
                    :url="urlBase"
                    @deletItem="getRows"
                  >
                  </LazyModalDelete>
                </template>
                <template #cell(updated_at)="data">
                  {{ data.item.updated_at | formatDateTime }}
                </template>
              </BTable>
            </BOverlay>
          </BCard>
          <div class="row">
            <div class="col-sm-12 col-md-8">
              <BPagination
                v-model="currentPage"
                :total-rows="totalRows"
                :per-page="perPage"
                limit="8"
                class="pagination-danger"
                @input="getRows"
              ></BPagination>
            </div>
            <div class="col-sm-12 col-md-4 d-flex justify-content-end">
              <BFormSelect
                v-model="perPage"
                :options="perPageOptions"
                @change="getRows"
              ></BFormSelect>
            </div>
          </div>
        </template>
      </LazyInputUploadFile>
    </div>
    <client-only>
      <div v-if="registerRows.length > 0" class="col-12">
        <BCard>
          <template #header>
            <div class="row">
              <div class="col-12 col-md-6">
                <h6 class="mb-0">{{ selectedRow[0].year }}</h6>
              </div>
              <div class="col-12 col-md-6 d-flex justify-content-end">
                <div class="form-check form-check-inline">
                  <input
                    id="type-geoencoder-select"
                    v-model="typeGeoencoder"
                    class="form-check-input"
                    type="radio"
                    name="type-geoencoder-select"
                    value="select"
                  />
                  <label class="form-check-label" for="type-geoencoder-select"
                    >Selecionados</label
                  >
                </div>
                <div class="form-check form-check-inline">
                  <input
                    id="type-geoencoder-all"
                    v-model="typeGeoencoder"
                    class="form-check-input"
                    type="radio"
                    name="type-geoencoder-all"
                    value="all"
                  />
                  <label class="form-check-label" for="type-geoencoder-all"
                    >Todos</label
                  >
                </div>
                <button class="btn btn-primary" @click="geoEncoder">
                  <b-icon-pin-map />
                  Georreferenciar
                </button>
              </div>
            </div>
          </template>
          <BOverlay :show="show">
            <BTable
              id="table-born-alive-form"
              striped
              hover
              :fields="registeFields"
              :items="registerRows"
              :busy="isBusy"
              primary-key="id"
              select-mode="multi"
              selectable
              @row-selected="onRegisterRowSelected"
            >
              <template #cell(selected)="{ rowSelected }">
                <template v-if="rowSelected">
                  <span aria-hidden="true">&check;</span>
                  <span class="sr-only">Selected</span>
                </template>
                <template v-else>
                  <span aria-hidden="true">&nbsp;</span>
                  <span class="sr-only">Not selected</span>
                </template>
              </template>
              <template #cell(geometry)="data">
                {{ data.item.geometry ? data.item.geometry.coordinates : '' }}
              </template>
              <template #cell(updated_at)="data">
                {{ data.item.updated_at | formatDateTime }}
              </template>
            </BTable>
          </BOverlay>
        </BCard>
        <div class="row">
          <div class="col-sm-12 col-md-8">
            <BPagination
              v-model="registerCurrentPage"
              :total-rows="registerTotalRows"
              :per-page="registerPerPage"
              limit="8"
              class="pagination-danger"
              @input="getRegisterRows"
            ></BPagination>
          </div>
          <div class="col-sm-12 col-md-4 d-flex justify-content-end">
            <BFormSelect
              v-model="registerPerPage"
              :options="perPageOptions"
              @change="getRegisterRows"
            ></BFormSelect>
          </div>
        </div>
      </div>
    </client-only>
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
        { key: 'selected', label: '', sortable: false },
        { key: 'id', label: 'Id', sortable: true },
        { key: 'year', label: 'Ano', sortable: true },
        { key: 'source', label: 'Fonte', sortable: true },
        { key: 'color', label: 'Cor', sortable: true },
        { key: 'delete', label: 'Delete', sortable: false },
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
      selectedRow: [],
      show: false,
      urlRegisters: 'dataset/register',
      registerRows: [],
      registerTotalRows: 0,
      registerCurrentPage: 1,
      registerPerPage: 10,
      registeFields: [
        { key: 'selected', label: '', sortable: false },
        { key: 'id', label: 'Id', sortable: true },
        { key: 'nm_logrado', label: 'Logradouro', sortable: true },
        { key: 'nu_numero', label: 'Número', sortable: true },
        { key: 'nm_bairro', label: 'Bairro', sortable: true },
        { key: 'geometry', label: 'Geometria', sortable: true },
        { key: 'updated_at', label: 'Update', sortable: true },
      ],
      selectedRegisterRow: [],
      typeGeoencoder: 'select',
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
    this.urlBase = `dataset/${this.source}/${this.system}/${this.initial}/`;
  },
  mounted() {
    this.getRows();
  },
  methods: {
    upload() {
      this.registerRows = [];
      // this.$refs.table.getRows();
      this.getRows();
    },
    async getRows() {
      this.isBusy = !this.isBusy;
      const response = await this.$axios.get(this.urlBase + this.genPage(), {
        params: this.params,
      });
      this.rows = await response.data.data;
      this.totalRows = await response.data.total;
      this.isBusy = !this.isBusy;
    },
    async getRegisterRows() {
      const id = this.selectedRow[0].id;
      this.show = !this.show;
      const response = await this.$axios.get(
        `${this.urlRegisters}/${id}${this.registeGenPage()}`
      );
      const registerRows = await response.data.data;

      registerRows.forEach((item) => {
        item.geometry = JSON.parse(item.geometry);
      });

      this.registerRows = registerRows;
      this.registerTotalRows = await response.data.total;
      console.log(this.registerRows);
      this.show = !this.show;
    },
    genPage() {
      return `?per_page=${this.perPage}&page=${this.currentPage}`;
    },
    registeGenPage() {
      return `?per_page=${this.registerPerPage}&page=${this.registerCurrentPage}`;
    },
    onRowSelected(items) {
      this.selectedRow = items;

      this.getRegisterRows();
    },
    onRegisterRowSelected(items) {
      this.selectedRegisterRow = items;
    },
    geoEncoder() {
      this.show = !this.show;
      this.selectedRow.forEach(async (dataset) => {
        if (this.typeGeoencoder === 'select') {
          if (this.selectedRegisterRow.length > 0) {
            const ids = this.selectedRegisterRow.map((registe) => {
              return registe.id;
            });

            await this.$axios.put(`dataset/register/${dataset.id}`, {
              register_ids: ids,
            });
          }
        } else {
          await this.$axios.put(`dataset/register/${dataset.id}`);
        }
      });
      this.getRegisterRows();
      this.show = !this.show;
      return false;
    },
    async changeColor(e, data) {
      await this.$axios.put(`${this.urlBase}${data}`, {
        color: e ,
      });
    },
  },
};
</script>

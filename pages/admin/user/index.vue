<template>
  <main class="container-fluid">
    <div class="row m-2 justify-content-between">
      <div class="col-sm-12 col-md-6">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          class="pagination-danger"
          @input="getRows"
        ></b-pagination>
      </div>
      <div class="col-sm-12 col-md-4">
        <div class="input-group">
          <input
            v-model="search"
            type="text"
            class="form-control"
            @input="searchHandler"
          />
          <div class="input-group-append">
            <span class="input-group-text">
              <BIconSearch></BIconSearch>
            </span>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-2 col-xl-1">
        <LazyFormsUser
          text-button="Cadastar"
          variant="primary"
          @createMember="getRows"
        ></LazyFormsUser>
      </div>
    </div>
    <div class="row justify-content-between">
      <div class="col-12">
        <BCard class="text-center">
          <BTable
            id="table-users"
            striped
            responsive
            hover
            :fields="fields"
            :items="listUsers"
            primary-key="id"
          >
            <template #cell(id)="data">
              {{ data.item.id }}
            </template>
            <template #cell(name)="data">
              {{ data.item.name }}
            </template>
            <template #cell(email)="data">
              {{ data.item.email }}
            </template>
            <template #cell(edit)="data">
              <LazyFormsUser
                text-button="Editar"
                :old-user="data.item"
                variant="primary"
                @updateMember="getRows"
              ></LazyFormsUser>
            </template>
            <template #cell(delete)="data">
              <LazyModalDelete :item="data.item" url="user/" @deletItem="getRows">
              </LazyModalDelete>
            </template>
          </BTable>
        </BCard>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'AdminPage',
  data() {
    return {
      fields: [
        { key: 'id', label: 'Id', sortable: true },
        { key: 'name', label: 'Nome', sortable: true },
        { key: 'email', label: 'E-mail', sortable: true },
        { key: 'edit', label: 'Editar' },
        { key: 'delete', label: 'Excluir' },
      ],
      perPage: 10,
      currentPage: 1,
      totalRows: 0,
      search: '',
      listUsers: [],
    };
  },
  fetch() {
    // this.getRows();
  },
  created() {
    this.getRows();
    this.welcomeMessage();
  },
  methods: {
    welcomeMessage() {
      this.$store.commit('layout/CHANGE_NAV_TITLE', 'Usuários');
    },
    async getRows() {
      const params = {
        per_page: this.perPage,
        page: this.currentPage,
      };

      if (this.search.length > 3) {
        params.keyword = this.search;
      }

      try {
        const response = await this.$axios.get(`user/`, {
          params,
        });
        this.listUsers = await response.data.data;
        this.totalRows = await response.data.total;
      } catch (error) {
        /* if(error.response.status === 401) {
          this.$router.push('/');
        } */
      }
    },
    searchHandler() {
      if (this.search.length > 3) {
        this.getRows();
      }
    },
  },
};
</script>

<style>
main {
  width: 100%;
}
</style>

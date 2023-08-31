<template>
  <div>
    <b-button
      v-b-modal="`modal-xl-${id}`"
      :variant="variant"
      @click="getVaccinationSupports"
    >
      {{ textButton }}
    </b-button>
    <b-modal
      :id="`modal-xl-${id}`"
      size="xl"
      scrollable
      title="Adicionar Posto"
    >
      <div class="row justify-content-between">
        <div class="col-12">
          <BCard class="text-center">
            <div class="d-flex justify-content-end p-1">
              <BFormGroup
                label="Busca"
                label-for="filter-input"
                label-cols-sm="3"
                label-align-sm="right"
                label-size="sm"
                class="mb-0"
              >
                <b-input-group size="sm">
                  <b-form-input
                    id="filter-input"
                    v-model="filter"
                    type="search"
                    placeholder="Busca do posto"
                  ></b-form-input>

                  <b-input-group-append>
                    <b-button :disabled="!filter" @click="filter = ''"
                      >Limpar</b-button
                    >
                  </b-input-group-append>
                </b-input-group>
              </BFormGroup>
            </div>
            <BTable
              id="table-campaign-supports"
              striped
              responsive
              hover
              :filter="filter"
              :fields="fields"
              :items="viccinationPoints"
              primary-key="id"
            >
              <template #cell(id)="data">
                {{ data.item.id }}
              </template>
              <template #cell(name)="data">
                {{ data.item.name }}
              </template>
              <template #cell(address)="data">
                {{ data.item.address }}
              </template>
              <template #cell(number)="data">
                {{ data.item.number }}
              </template>
              <template #cell(edit)="data">
                <NuxtLink
                  :to="`/ncrlo/campaign/support/${data.item.id}`"
                  class="btn btn-warning"
                >
                  Detalhes
                </NuxtLink>
              </template>
              <template #cell(add)="data">
                <b-button variant="success" @click="addSupport(data.item)"
                  >Adicionar</b-button
                >
              </template>
            </BTable>
          </BCard>
        </div>
      </div>
      <template #modal-footer="{ cancel }">
        <b-button variant="danger" @click="cancel()"> Sair </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'FormsAddSupport',
  components: {},
  props: {
    textButton: {
      type: String,
      required: true,
    },
    variant: {
      type: String,
      required: true,
    },
    currentSupport: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      id: null,
      show: false,
      url: 'ncrlo/vaccination/point',
      viccinationPoints: [],
      filter: "",
      filterOn: ['neme', 'address'],
      fields: [
        {
          key: 'id',
          label: 'Id',
          sortable: true,
        },
        {
          key: 'name',
          label: 'Name',
          sortable: true,
        },
        {
          key: 'address',
          label: 'Endereço',
          sortable: true,
        },
        {
          key: 'number',
          label: 'Número',
        },
        {
          key: 'edit',
          label: 'Editar',
        },
        {
          key: 'add',
          label: 'Adicionar',
        },
      ],
    };
  },
  computed: {},
  created() {},
  methods: {
    async getVaccinationSupports() {
      const response = await this.$axios.get(`${this.url}`, {
        params: {
          support_id: this.currentSupport.id,
        },
      });
      this.viccinationPoints = response.data;
    },
    addSupport(support) {
      this.$emit('addSupport', support);
      const index = this.viccinationPoints.findIndex((item) => {
        if (item.id === support.id) {
          return true;
        }
        return false;
      });

      this.viccinationPoints.splice(index, 1);
    },
  },
};
</script>

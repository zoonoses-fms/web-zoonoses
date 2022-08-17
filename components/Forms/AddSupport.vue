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
      title="Adicionar Ponto de Apoio"
    >
      <div class="row justify-content-between">
        <div class="col-12">
          <b-card class="text-center">
            <b-table
              id="table-campaign-supports"
              striped
              responsive
              hover
              :fields="fields"
              :items="viccinationSupports"
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
                <b-button variant="success" @click="addSupport(data.item)">Adicionar</b-button>
              </template>
            </b-table>
          </b-card>
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
    currentCycle: {
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      id: null,
      show: false,
      url: 'ncrlo/vaccination/support',
      viccinationSupports: [],
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
          campaign_cycle_id: this.currentCycle.id
        }
      });
      this.viccinationSupports = response.data;
    },
    addSupport(support) {
      this.$emit('addSupport', support);
      const index = this.viccinationSupports.findIndex((item) => {
        if(item.id === support.id) {
          return true;
        }
        return false;
      });

      this.viccinationSupports.splice(index, 1);

    }
  },
};
</script>

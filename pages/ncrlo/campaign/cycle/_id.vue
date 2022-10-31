<template>
  <main class="container-fluid">
    <div class="row m-2 justify-content-between">
      <div class="col-sm-12 col-md-6 d-flex justify-content-star">
        <NuxtLink to="/ncrlo/vaccination/support" class="btn btn-success">
          Todos os Pontos de Apoio
        </NuxtLink>
        <ModalSearchWorker :cycle-id="cycle.id"> </ModalSearchWorker>
      </div>
      <div class="col-sm-12 col-md-6 d-flex justify-content-end">
        <FormsAddSupport
          text-button="Adicionar Apoio"
          variant="primary"
          :current-cycle.sync="cycle"
          @addSupport="addSupport"
        ></FormsAddSupport>
      </div>
    </div>
    <div v-if="newSupports.length > 0">
      <div class="row justify-content-between">
        <div class="col-12">
          <b-card class="text-center">
            <template #header>
              <div class="row m-0">
                <div class="col-sm-12 col-md-6 d-flex justify-content-start">
                  <h5 class="mb-0">Novos Pontos de Apoio</h5>
                </div>
                <div class="col-sm-12 col-md-6 d-flex justify-content-end">
                  <b-button variant="success" @click="saveSupport">
                    Salvar
                  </b-button>
                </div>
              </div>
            </template>
            <b-table
              id="table-cycle-supports"
              striped
              responsive
              hover
              :fields="fieldsListAdd"
              :items="newSupports"
              primary-key="id"
            >
              <template #cell(name)="data">
                {{ data.item.name }}
              </template>
              <template #cell(address)="data">
                {{ data.item.address }}
              </template>
              <template #cell(number)="data">
                {{ data.item.number }}
              </template>
            </b-table>
          </b-card>
        </div>
      </div>
    </div>
    <div class="row justify-content-between">
      <div class="col-12">
        <b-card>
          <b-table
            id="table-cycle-new-supports"
            striped
            responsive
            hover
            small
            :fields="fields"
            :items="supports"
            primary-key="id"
          >
            <template #cell(pendency)="data">
              <div class="d-flex justify-content-center">
                <b-icon
                  v-if="data.item.pendency"
                  icon="exclamation-circle"
                  variant="danger"
                  font-scale="2"
                ></b-icon>
                <b-icon
                  v-else
                  icon="check-circle"
                  variant="success"
                  font-scale="2"
                ></b-icon>
              </div>
            </template>
            <template #cell(name)="data">
              {{ data.item.support.name }}
            </template>
            <template #cell(address)="data">
              {{ data.item.support.address }}
            </template>
            <template #cell(number)="data">
              {{ data.item.support.number }}
            </template>
            <template #cell(neighborhood)="data">
              <div v-if="data.item.support.neighborhood_alias !== null">
                {{ data.item.support.neighborhood_alias.name }}
              </div>
            </template>
            <template #cell(saad)="data">
              <span v-for="saad in data.item.saads" :key="saad.id">
                {{ saad.name }}
              </span>
            </template>
            <template #cell(frequency)="data">
              <b-button
                class="mt-0"
                variant="warning"
                @click="allocationPdf(data.item)"
              >
                <b-icon icon="person-badge-fill"></b-icon>
              </b-button>
            </template>
            <template #cell(edit)="data">
              <FormsCampaignSupport
                text-button=""
                variant="success"
                :old-support="data.item"
                :title="data.item.support.name"
                @update="getDetailCycle"
              ></FormsCampaignSupport>
            </template>
            <template #cell(details)="data">
              <NuxtLink
                :to="`/ncrlo/campaign/support/${data.item.id}`"
                class="btn btn-warning"
              >
                <b-icon icon="search"></b-icon>
              </NuxtLink>
            </template>
            <template #cell(delete)="data">
              <ModalDelete
                :item="data.item"
                :url="urlCampaignSupport"
                text-button=""
                @deletItem="getDetailCycle"
              >
              </ModalDelete>
            </template>
          </b-table>
        </b-card>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'CycleDetailsPage',
  data() {
    return {
      cycle: {},
      supports: [],
      newSupports: [],
      url: 'ncrlo/campaign/cycle/',
      urlCampaignSupport: 'ncrlo/campaign/support/',
      fieldsListAdd: [
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
      ],
      fields: [
        {
          key: 'pendency',
          label: 'Pendência',
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
          key: 'neighborhood',
          label: 'Bairro',
        },
        {
          key: 'saad',
          label: 'SAAD',
        },
        {
          key: 'frequency',
          label: 'Frequência',
        },
        {
          key: 'edit',
          label: 'Editar',
        },
        {
          key: 'details',
          label: 'Detalhes',
        },
        {
          key: 'delete',
          label: 'Excluir',
        },
      ],
    };
  },

  created() {
    this.getDetailCycle();
    this.welcomeMessage();
  },
  methods: {
    welcomeMessage() {
      this.$store.commit(
        'layout/CHANGE_NAV_TITLE',
        'Pontos de apoio a campanha de vacinação'
      );
    },
    async getDetailCycle() {
      this.supports = [];

      const response = await this.$axios.get(
        `${this.url}${this.$route.params.id}`
      );
      this.cycle = response.data;

      this.cycle.supports.forEach((support) => {
        support.pendency = false;
        if (
          support.is_rural &&
          (support.rural_supervisors.length === 0 ||
            support.rural_assistants.length === 0 ||
            support.vaccinators.length === 0 ||
            support.drivers.length === 0)
        ) {
          support._rowVariant = 'danger';
          support.pendency = true;
        } else if (
          !support.is_rural &&
          (support.coordinator_id === null ||
            support.supervisors.length === 0 ||
            support.drivers.length === 0)
        ) {
          support._rowVariant = 'danger';
          support.pendency = true;
        }

        this.supports.push(support);
      });
    },
    addSupport(support) {
      this.newSupports.push({ ...support, _rowVariant: 'success' });
    },
    saveSupport() {
      let counter = 0;
      const i = setInterval(async () => {
        const element = this.newSupports[counter];

        try {
          await this.$axios.post(`${this.urlCampaignSupport}`, {
            ...element,
            campaign_cycle_id: this.$route.params.id,
          });
          this.$bvToast.toast('Cadastro efetuado!', {
            title: 'Sucesso',
            autoHideDelay: 5000,
            variant: 'success',
            solid: true,
          });
        } catch (errors) {
          for (const prop in errors.response.data) {
            errors.response.data[prop].forEach((element) => {
              this.$bvToast.toast(element, {
                title: 'Error',
                autoHideDelay: 5000,
                variant: 'danger',
                solid: true,
              });
            });
          }
        }

        counter++;
        if (counter === this.newSupports.length) {
          this.newSupports = [];
          this.getDetailCycle();
          clearInterval(i);
        }
      }, 1000);
    },
    async allocationPdf(support) {
      try {
        const response = await this.$axios.get(
          `${this.urlCampaignSupport}allocation/${support.id}`,
          {
            responseType: 'blob',
          }
        );
        const today = new Date().toISOString().slice(0, 10);
        const blob = new Blob([response.data], { type: 'application/pdf' });
        // const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.target = '_blank';
        link.download = `${today}-Frequência de Locação de Pessoal.pdf`;
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
  },
};
</script>

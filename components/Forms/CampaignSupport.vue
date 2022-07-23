<template>
  <div>
    <b-button v-b-modal="`modal-xl-${id}`" :variant="variant" @click="showForm">
      {{ textButton }}
    </b-button>
    <ValidationObserver v-slot="{ invalid }">
      <b-modal
        :id="`modal-xl-${id}`"
        size="xl"
        scrollable
        :title="textButton"
        class="shadow-lg"
        @ok="handleOk"
      >
        <b-overlay :show="show" rounded="sm">
          <div class="row">
            <div class="col-12 d-flex justify-content-end">
              <NuxtLink to="/ncrlo/vaccination/worker" class="btn btn-success">
                Lista Equipe
              </NuxtLink>
            </div>
          </div>

          <form ref="form" @submit.stop.prevent>
            {{ support }}
          </form>
          <div class="row">
            <div class="col-12 col-md-6">
              <div
                class="form-group border border-success rounded p-1 overflow-auto workers"
              >
                <label>Selecione o Coordenador</label>
                <FormsSelectWorker
                  :campaign-id="support.campaign_id"
                  :selected-worker="support.vaccination_worker_id"
                  list-type="coordinator"
                  @change="setCoordinator"
                ></FormsSelectWorker>
              </div>
            </div>
            <div class="col-12 col-md-6">
              <div
                class="form-group border border-success rounded p-1 overflow-auto workers"
              >
                <label>Selecione os Supervisores</label>
                <FormsSelectWorker
                  :campaign-id="support.campaign_id"
                  :selected-worker="support.supervisors"
                  list-type="supervisors"
                  :multiple="true"
                  @change="setSupervisors"
                ></FormsSelectWorker>
              </div>
            </div>
          </div>
        </b-overlay>
        <template #modal-footer="{ ok, cancel }">
          <button class="btn btn-success" :disabled="invalid" @click="ok()">
            Salvar
          </button>
          <b-button variant="danger" @click="cancel()"> Sair </b-button>
        </template>
      </b-modal>
    </ValidationObserver>
  </div>
</template>

<script>
import { ValidationObserver } from 'vee-validate';
export default {
  name: 'FormCampaignSupport',
  components: {
    ValidationObserver,
  },
  props: {
    textButton: {
      type: String,
      required: true,
    },
    variant: {
      type: String,
      required: true,
    },
    oldSupport: {
      type: Object,
      default() {
        return {
          id: null,
          campaign_id: null,
          coordinator_id: null,
          vaccination_worker_id: null,
          supervisors: [],
        };
      },
    },
  },
  data() {
    return {
      id: null,
      show: false,
      url: 'ncrlo/campaign/support/',
      support: {
        type: Object,
        default() {
          return {
            id: null,
            campaign_id: null,
            coordinator_id: null,
            vaccination_worker_id: null,
            supervisors: [],
          };
        },
      },
      geocodes: [],
      selectedFeature: [],
      fields: [
        {
          key: 'selected',
          label: '',
          sortable: true,
        },
        {
          key: 'place',
          label: 'Local',
          sortable: true,
        },
      ],
      editable: false,
      add: false,
    };
  },
  watch: {},
  created() {
    this.id = this.oldSupport.id;
  },
  methods: {
    showForm() {
      this.support = { ...this.oldSupport };
    },
    handleOk() {
      this.show = true;
      if (this.support.id) {
        this.update();
      } else {
        this.create();
      }
      this.$nextTick(() => {
        // this.$bvModal.hide(`modal-xl-${this.id}`);
      });
      this.show = false;
    },
    async create() {
      try {
        const response = await this.$axios.post(`${this.url}`, this.support);
        this.support = response.data;
        this.$emit('updateSupport');
        this.$bvToast.toast('Cadastro efetuado!', {
          title: 'Sucesso',
          autoHideDelay: 5000,
          variant: 'success',
          solid: true,
        });
        this.show = false;
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

        this.show = false;
      }
    },
    async update() {
      try {
        const response = await this.$axios.put(
          `${this.url}${this.support.id}/`,
          this.support
        );
        this.support = response.data;
        this.$emit('updateSupport');
        this.$bvToast.toast('Cadastro atualizado!', {
          title: 'Sucesso',
          autoHideDelay: 5000,
          variant: 'success',
          solid: true,
        });

        this.show = false;
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
    },
    setCoordinator(id) {
      this.support.vaccination_worker_id = id;
    },
    setSupervisors(ids) {
      this.support.supervisors = ids;
    },
  },
};
</script>
<style scoped>
.table {
  height: 50vh;
  overflow-y: scroll;
}

.map-points {
  width: 100%;
  height: 50vh;
}

.workers {
  max-height: 200px;
}
</style>

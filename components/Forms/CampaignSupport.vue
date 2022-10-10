<template>
  <div>
    <b-button v-b-modal="`modal-xl-${id}`" :variant="variant" @click="showForm">
      <b-icon icon="pencil"></b-icon>
      {{ textButton }}
    </b-button>
    <ValidationObserver v-slot="{ invalid }">
      <b-modal
        :id="`modal-xl-${id}`"
        size="xl"
        scrollable
        :title="textButton"
        @ok="handleOk"
      >
        <b-overlay :show="show" rounded="sm">
          <div class="">
            <div class="row pb-1">
              <div class="col-12 d-flex justify-content-end">
                <NuxtLink
                  to="/ncrlo/vaccination/worker"
                  class="btn btn-success"
                >
                  Lista da equipe
                </NuxtLink>
              </div>
            </div>

            <form ref="form" @submit.stop.prevent></form>
            <div class="row">
              <div class="col-6 col-md-3">
                <div class="form-group">
                  <label for="goal-input">Meta:</label>
                  <input
                    v-model="support.goal"
                    name="goal-input"
                    class="form-control"
                    type="number"
                  />
                </div>
              </div>
              <div class="col-6 col-md-3">
                <div class="form-group">
                  <label for="mileage-input">Quilometragem:</label>
                  <input
                    v-model="support.mileage"
                    name="mileage-input"
                    class="form-control"
                    type="number"
                  />
                </div>
              </div>
              <div class="col-12 col-md-6">
                <b-form-checkbox
                  id="checkbox-is-rural"
                  v-model="support.is_rural"
                  name="is_rural"
                >
                  Área Rural?
                </b-form-checkbox>
              </div>
            </div>
            <div v-show="support.is_rural" class="row">
              <div class="col-12 col-md-6">
                <div class="form-group border border-success rounded p-1">
                  <label>Supervisores Rural</label>
                  <FormsSelectWorker
                    :campaign-cycle-id="support.campaign_cycle_id"
                    :selected-worker="support.rural_supervisors"
                    list-type="rural_supervisors"
                    :multiple="true"
                    @change="setRuralSupervisors"
                  ></FormsSelectWorker>
                </div>
              </div>

              <div class="col-12 col-md-6">
                <div class="form-group border border-success rounded p-1">
                  <label>Auxiliar Rural</label>
                  <FormsSelectWorker
                    :campaign-cycle-id="support.campaign_cycle_id"
                    :selected-worker="support.rural_assistants"
                    list-type="rural_assistants"
                    :multiple="true"
                    @change="setRuralAssistants"
                  ></FormsSelectWorker>
                </div>
              </div>
            </div>
            <div v-show="!support.is_rural" class="row">
              <div class="col-12 col-md-6">
                <div class="form-group border border-success rounded p-1">
                  <label>Selecione o Coordenador</label>
                  <FormsSelectWorker
                    :campaign-cycle-id="support.campaign_cycle_id"
                    :selected-worker="support.coordinator_id"
                    list-type="coordinator"
                    @change="setCoordinator"
                  ></FormsSelectWorker>
                </div>
              </div>

              <div class="col-12 col-md-6">
                <div class="form-group border border-success rounded p-1">
                  <label>Selecione os Supervisores</label>
                  <FormsSelectWorker
                    :campaign-cycle-id="support.campaign_cycle_id"
                    :selected-worker="support.supervisors"
                    list-type="supervisors"
                    :multiple="true"
                    @change="setSupervisors"
                  ></FormsSelectWorker>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12 col-md-6">
                <div class="form-group border border-success rounded p-1">
                  <label>Selecione os Motorista</label>
                  <FormsSelectWorker
                    :campaign-cycle-id="support.campaign_cycle_id"
                    :selected-worker="support.drivers"
                    list-type="drivers"
                    :multiple="true"
                    @change="setDrivers"
                  ></FormsSelectWorker>
                </div>
              </div>
              <div v-show="!support.is_rural" class="col-12 col-md-6">
                <div class="form-group border border-success rounded p-1">
                  <label>Selecione os Apoiadores</label>
                  <FormsSelectWorker
                    :campaign-cycle-id="support.campaign_cycle_id"
                    :selected-worker="support.assistants"
                    list-type="assistants"
                    :multiple="true"
                    @change="setAssistants"
                  ></FormsSelectWorker>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="form-group border border-success rounded p-1">
                  <label>Selecione os SAAD</label>
                  <FormsSelectSaad
                    :selected-saads="support.saads"
                    :multiple="true"
                    @change="setSaads"
                  ></FormsSelectSaad>
                </div>
              </div>
              <div class="col-12 col-md-6">
                <div class="form-group border border-success rounded p-1">
                  <label v-show="!support.is_rural">
                    Selecione os Vacinadores Resesva
                  </label>
                  <label v-show="support.is_rural">
                    Selecione os Vacinadores
                  </label>
                  <FormsSelectWorker
                    :campaign-cycle-id="support.campaign_cycle_id"
                    :selected-worker="support.vaccinators"
                    list-type="vaccinators"
                    :multiple="true"
                    @change="setVaccinators"
                  ></FormsSelectWorker>
                </div>
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
          campaign_cycle_id: null,
          coordinator_id: null,
          vaccination_support_id: null,
          goal: null,
          drivers: [],
          supervisors: [],
          assistants: [],
          vaccinators: [],
          is_rural: false,
          rural_supervisors: [],
          rural_assistants: [],
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
            campaign_cycle_id: null,
            coordinator_id: null,
            vaccination_support_id: null,
            goal: null,
            drivers: [],
            supervisors: [],
            assistants: [],
            vaccinators: [],
            is_rural: false,
            rural_supervisors: [],
            rural_assistants: [],
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
        this.$emit('create');
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
        this.$emit('update');
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
      this.support.coordinator_id = id;
    },
    setSupervisors(ids) {
      this.support.supervisors = ids;
    },
    setDrivers(ids) {
      this.support.drivers = ids;
    },
    setAssistants(ids) {
      this.support.assistants = ids;
    },
    setVaccinators(ids) {
      this.support.vaccinators = ids;
    },
    setRuralSupervisors(ids) {
      this.support.rural_supervisors = ids;
    },
    setRuralAssistants(ids) {
      this.support.rural_assistants = ids;
    },
    setSaads(ids) {
      this.support.saads = ids;
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
  height: 80vh;
}
</style>

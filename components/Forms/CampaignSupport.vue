<template>
  <div>
    <b-button v-b-modal="`modal-xl-${id}`" :variant="variant" @click="showForm">
      <b-icon-pencil></b-icon-pencil>
      {{ textButton }}
    </b-button>
    <ValidationObserver v-slot="{ invalid }">
      <b-modal
        :id="`modal-xl-${id}`"
        size="xl"
        scrollable
        :title="title"
        @ok="handleOk"
      >
        <b-overlay :show="show" rounded="sm">
          <div class="container-fluid">
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

            <div class="row">
              <div class="col-4 col-lg-2">
                <div class="form-group">
                  <label for="goal-input">Ordem:</label>
                  <input
                    v-model="support.order"
                    name="goal-input"
                    class="form-control"
                    type="number"
                  />
                </div>
              </div>
              <div class="col-4 col-lg-2">
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
              <div class="col-4 col-lg-2">
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
              <div class="col-12 col-lg-3">
                <div class="form-group border border-success rounded p-1">
                  <label>Selecione os SAAD</label>
                  <FormsSelectSaad
                    :selected-saads="support.saads"
                    :multiple="true"
                    @change="setSaads"
                  ></FormsSelectSaad>
                </div>
              </div>
              <div class="col-12 col-lg-3">
                <b-form-checkbox
                  id="checkbox-is-rural"
                  v-model="support.is_rural"
                  name="is_rural"
                >
                  Área Rural?
                </b-form-checkbox>
              </div>
            </div>
            <FormsSelectProfiles
              v-model="support.profiles"
              :date="cycle.start"
            />
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
    cycle: {
      type: Object,
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
          order: null,
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
    title: {
      type: String,
      default: '',
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
            order: null,
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
        await this.$axios.post(`${this.url}`, this.support);
        this.$emit('input', { status: 'create' });
      } catch (errors) {
        this.$emit('input', { status: 'errors', errors });
        this.show = false;
      }
    },
    async update() {
      try {
        await this.$axios.put(`${this.url}${this.support.id}`, this.support);
        this.$emit('input', { status: 'update' });
      } catch (errors) {
        this.$emit('input', { status: 'errors', errors });
        this.show = false;
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
    log() {
      console.log(this.cycle);
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

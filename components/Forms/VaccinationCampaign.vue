<template>
  <div>
    <b-button
      v-b-modal="`modal-md-${id}`"
      :variant="variant"
      @click="setCampaign"
    >
      {{ textButton }}
    </b-button>
    <ValidationObserver v-slot="{ valid }">
      <form @submit.prevent="handleOk">
        <b-modal
          :id="`modal-md-${id}`"
          size="md"
          scrollable
          :title="vaccinationCampaign.year ? `${vaccinationCampaign.year}` : ``"
          @ok="handleOk"
        >
          <b-overlay :show="show" rounded="sm">
            <div class="row p-3">
              <div class="col-12 p-4 shadow bg-white rounded">
                <div class="row">
                  <div class="col-4 px-1">
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="Ano"
                      :rules="{ required: true, min: 4, max: 4 }"
                    >
                      <div class="form-group">
                        <label for="year-input">Ano</label>
                        <select
                          v-model="vaccinationCampaign.year"
                          name="year-input"
                          class="form-control form-control-sm"
                        >
                          <option
                            v-for="(year, index) in years"
                            :key="index"
                            :value="year"
                          >
                            {{ year }}
                          </option>
                        </select>
                        <div
                          v-for="(error, index) in errors"
                          :key="index"
                          class="invalid-feedback d-block"
                        >
                          {{ error }}
                        </div>
                      </div>
                    </ValidationProvider>
                  </div>
                  <div class="col-4 px-1">
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="Início"
                      :rules="{ required: true }"
                    >
                      <div class="form-group">
                        <label for="start-input">Início</label>
                        <input
                          v-model="vaccinationCampaign.start"
                          name="start-input"
                          class="form-control form-control-sm"
                          type="date"
                        />
                        <div
                          v-for="(error, index) in errors"
                          :key="index"
                          class="invalid-feedback d-block"
                        >
                          {{ error }}
                        </div>
                      </div>
                    </ValidationProvider>
                  </div>
                  <div class="col-4 px-1">
                    <div class="form-group">
                      <label for="end-input">Fim</label>
                      <input
                        v-model="vaccinationCampaign.end"
                        name="end-input"
                        class="form-control form-control-sm"
                        type="date"
                      />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-3 px-1">
                    <div class="form-group">
                      <label for="goal-input">Meta:</label>
                      <input
                        v-model="vaccinationCampaign.goal"
                        name="goal-input"
                        class="form-control form-control-sm"
                        type="number"
                      />
                    </div>
                  </div>
                  <div class="col-3 px-1">
                    <div class="form-group">
                      <label for="coordinator-cost-input">Coordenador:</label>
                      <money
                        v-model="vaccinationCampaign.coordinator_cost"
                        v-bind="money"
                        name="coordinator-cost-input"
                        class="form-control form-control-sm"
                        type="text"
                      />
                    </div>
                  </div>
                  <div class="col-3 px-1">
                    <div class="form-group">
                      <label for="assistant-cost-input">Auxiliar:</label>
                      <money
                        v-model="vaccinationCampaign.assistant_cost"
                        v-bind="money"
                        name="assistant-cost-input"
                        class="form-control form-control-sm"
                        type="text"
                      />
                    </div>
                  </div>
                  <div class="col-3 px-1">
                    <div class="form-group">
                      <label for="supervisor-cost-input">Supervisor:</label>
                      <money
                        v-model="vaccinationCampaign.supervisor_cost"
                        v-bind="money"
                        name="supervisor-cost-input"
                        class="form-control form-control-sm"
                        type="text"
                      />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-3 px-1">
                    <div class="form-group">
                      <label for="vaccinator-cost-input">Vacinador:</label>
                      <money
                        v-model="vaccinationCampaign.vaccinator_cost"
                        v-bind="money"
                        name="vaccinator-cost-input"
                        class="form-control form-control-sm"
                        type="text"
                      />
                    </div>
                  </div>
                  <div class="col-3 px-1">
                    <div class="form-group">
                      <label for="vaccine-cost-input">Vacina:</label>
                      <money
                        v-model="vaccinationCampaign.vaccine_cost"
                        v-bind="money"
                        name="vaccine-cost-input"
                        class="form-control form-control-sm"
                        type="text"
                      />
                    </div>
                  </div>
                  <div class="col-3 px-1">
                    <div class="form-group">
                      <label for="mileage-cost-input">KM:</label>
                      <money
                        v-model="vaccinationCampaign.mileage_cost"
                        v-bind="money"
                        name="mileage-cost-input"
                        class="form-control form-control-sm"
                        type="text"
                      />
                    </div>
                  </div>
                  <div class="col-3 px-1">
                    <div class="form-group">
                      <label for="driver-cost-input">Motorista:</label>
                      <money
                        v-model="vaccinationCampaign.driver_cost"
                        v-bind="money"
                        name="driver-cost-input"
                        class="form-control form-control-sm"
                        type="text"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </b-overlay>

          <template #modal-footer="{ ok, cancel }">
            <button
              type="submit"
              class="btn btn-success"
              :disabled="!valid && vaccinationCampaign.id === null"
              @click="ok()"
            >
              Salvar
            </button>
            <b-button variant="danger" @click="cancel()"> Sair </b-button>
          </template>
        </b-modal>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { Money } from 'v-money';
export default {
  name: 'FormsVaccinationCampaign',
  components: {
    ValidationObserver,
    ValidationProvider,
    Money,
  },
  props: {
    textButton: {
      type: String,
      required: true,
    },
    oldVaccinationCampaign: {
      type: Object,
      default() {
        return {
          id: null,
          year: null,
          start: null,
          end: null,
          goal: 0,
          coordinator_cost: 0,
          assistant_cost: 0,
          supervisor_cost: 0,
          vaccinator_cost: 0,
          vaccine_cost: 0,
          mileage_cost: 0,
          driver_cost: 0,
        };
      },
    },
    variant: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      id: null,
      show: false,
      url: 'ncrlo/campaign/',
      vaccinationCampaign: {
        id: null,
        year: null,
        start: null,
        end: null,
        goal: 0,
        coordinator_cost: 0,
        assistant_cost: 0,
        supervisor_cost: 0,
        vaccinator_cost: 0,
        vaccine_cost: 0,
        mileage_cost: 0,
        driver_cost: 0,
      },
      money: {
        decimal: ',',
        thousands: '.',
        prefix: 'R$ ',
        suffix: '',
        precision: 2,
        masked: false /* doesn't work with directive */,
      },
    };
  },
  computed: {
    years() {
      const today = new Date();
      const start = today.getFullYear() + 1;
      const end = 2010;
      const years = [];

      for (let i = start; i >= end; i--) {
        years.push(i);
      }
      return years;
    },
  },
  created() {
    this.id = this.oldVaccinationCampaign.id;
  },
  methods: {
    setCampaign() {
      this.vaccinationCampaign = { ...this.oldVaccinationCampaign };
      if (this.vaccinationCampaign.id) {
        // get data
      }
    },
    async create() {
      try {
        const response = await this.$axios.post(
          `${this.url}`,
          this.vaccinationCampaign
        );
        this.$bvToast.toast('Cadastro efetuado!', {
          title: 'Sucesso',
          autoHideDelay: 5000,
          variant: 'success',
          solid: true,
        });
        this.$emit('create', await response.data);
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
          `${this.url}${this.vaccinationCampaign.id}/`,
          this.vaccinationCampaign
        );
        this.$bvToast.toast('Cadastro atualizado!', {
          title: 'Sucesso',
          autoHideDelay: 5000,
          variant: 'success',
          solid: true,
        });
        this.$emit('update', await response.data);
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
    handleOk() {
      this.show = true;
      this.handleSubmit();
    },
    handleSubmit() {
      if (this.vaccinationCampaign.id) {
        this.update();
      } else {
        this.create();
      }
      this.$nextTick(() => {
        // this.$bvModal.hide(`modal-xl-${this.id}`);
      });
      this.show = false;
    },
  },
};
</script>

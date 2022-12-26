<!-- eslint-disable vue/no-parsing-error -->
<template>
  <div>
    <b-button
      v-b-modal="`modal-xl-${id}`"
      :variant="variant"
      @click="setCampaign"
    >
      <b-icon-pencil></b-icon-pencil>
      {{ textButton }}
    </b-button>
    <ValidationObserver v-slot="{ valid }">
      <form @submit.prevent="handleOk">
        <b-modal
          :id="`modal-xl-${id}`"
          size="xl"
          scrollable
          :title="cycle.description ? `${cycle.description}` : ``"
          @ok="handleOk"
        >
          <BOverlay :show="show" rounded="sm">
            <div class="container-fluid">
              <div class="row pb-1">
                <div class="col-8 form-row">
                  <div class="form-check form-check-inline p-0">
                    <label class="form-check-label">
                      Pagamento parcial Pré-campanha?
                      <input
                        v-model="cycle.partial_value"
                        class="form-check-input"
                        type="checkbox"
                      />
                    </label>
                  </div>
                  <div class="input-group col-12 col-md-3">
                    <input
                      v-model="cycle.percentage_value"
                      type="text"
                      class="form-control"
                      :disabled="!cycle.partial_value"
                    />
                    <div class="input-group-append input-sm">
                      <span class="input-group-text">%</span>
                    </div>
                  </div>
                </div>
                <div class="col-4 d-flex justify-content-end">
                  <NuxtLink
                    to="/ncrlo/vaccination/worker"
                    class="btn btn-success"
                  >
                    Lista da equipe
                  </NuxtLink>
                </div>
              </div>
              <div class="row">
                <div class="col-12 col-lg-3">
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="Número"
                    :rules="{ required: true, numeric: true }"
                  >
                    <div class="form-group">
                      <label
                        >Número:
                        <input
                          v-model="cycle.number"
                          name="number-input"
                          class="form-control form-control-sm"
                          type="text"
                        />
                        <div
                          v-for="(error, index) in errors"
                          :key="index"
                          class="invalid-feedback d-block"
                        >
                          {{ error }}
                        </div>
                      </label>
                    </div>
                  </ValidationProvider>
                </div>
                <div class="col-12 col-lg-3">
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="Descrição"
                    :rules="{ required: true }"
                  >
                    <div class="form-group">
                      <label
                        >Descrição:
                        <input
                          v-model="cycle.description"
                          name="number-input"
                          class="form-control form-control-sm"
                          type="text"
                        />
                        <div
                          v-for="(error, index) in errors"
                          :key="index"
                          class="invalid-feedback d-block"
                        >
                          {{ error }}
                        </div>
                      </label>
                    </div>
                  </ValidationProvider>
                </div>
                <div class="col-12 col-lg-3">
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="Início"
                    :rules="{ required: true }"
                  >
                    <div class="form-group">
                      <label
                        >Início:
                        <input
                          v-model="cycle.start"
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
                      </label>
                    </div>
                  </ValidationProvider>
                </div>
                <div class="col-12 col-lg-3">
                  <div class="form-group">
                    <label
                      >Fim:
                      <input
                        v-model="cycle.end"
                        name="end-input"
                        class="form-control form-control-sm"
                        type="date"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <FormsSelectProfiles
                v-model="cycle.profiles"
                :date="cycle.start"
              />
            </div>
          </BOverlay>

          <template #modal-footer="{ ok, cancel }">
            <button
              type="submit"
              class="btn btn-success"
              :disabled="!valid && cycle.id === null"
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
export default {
  name: 'FormsCampaignCycle',
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  props: {
    textButton: {
      type: String,
      required: true,
    },
    oldCampaignCycle: {
      type: Object,
      default() {
        return {
          id: null,
          number: null,
          description: null,
          start: null,
          end: null,
          campaign_id: null,
          partial_value: false,
          percentage_value: 0,
        };
      },
    },
    variant: {
      type: String,
      required: true,
    },
    currentCampaign: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      id: null,
      show: false,
      url: 'ncrlo/campaign/cycle/',
      cycle: {
        id: null,
        number: null,
        description: null,
        start: null,
        end: null,
        campaign_id: null,
        partial_value: false,
        percentage_value: 0,
      },
    };
  },
  computed: {},
  created() {
    this.id = this.oldCampaignCycle.id;
  },
  methods: {
    setCampaign() {
      this.cycle = { ...this.oldCampaignCycle };
    },
    async create() {
      try {
        await this.$axios.post(`${this.url}`, {
          ...this.cycle,
          campaign_id: this.currentCampaign.id,
        });
        this.$emit('input', { status: 'create' });
      } catch (errors) {
        this.$emit('input', { status: 'errors', errors });
        this.show = false;
      }
    },
    async update() {
      try {
        await this.$axios.put(`${this.url}${this.cycle.id}`, this.cycle);
        this.$emit('input', { status: 'update' });
      } catch (errors) {
        this.$emit('input', { status: 'errors', errors });
        this.show = false;
      }
    },
    handleOk() {
      this.show = true;
      this.handleSubmit();
    },
    handleSubmit() {
      if (this.cycle.id) {
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

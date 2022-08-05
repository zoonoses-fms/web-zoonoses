<template>
  <div>
    <b-button
      v-b-modal="`modal-md-${id}`"
      :variant="variant"
      @click="setCampaign"
    >
    <b-icon icon="pencil"></b-icon>
      {{ textButton }}
    </b-button>
    <ValidationObserver v-slot="{ valid }">
      <form @submit.prevent="handleOk">
        <b-modal
          :id="`modal-md-${id}`"
          size="md"
          scrollable
          :title="campaignCycle.number ? `${campaignCycle.number}` : ``"
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
                      :rules="{ required: true, numeric: true }"
                    >
                      <div class="form-group">
                        <label for="number-input">Número</label>
                        <input
                          v-model="campaignCycle.number"
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
                          v-model="campaignCycle.start"
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
                        v-model="campaignCycle.end"
                        name="end-input"
                        class="form-control form-control-sm"
                        type="date"
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
              :disabled="!valid && campaignCycle.id === null"
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
          start: null,
          end: null,
          campaign_id: null,
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
      url: 'ncrlo/campaign/cycle',
      campaignCycle: {
        id: null,
        number: null,
        start: null,
        end: null,
        campaign_id: null,
      },
    };
  },
  computed: {},
  created() {
    console.log(this.oldCampaignCycle);
    this.id = this.oldCampaignCycle.id;
  },
  methods: {
    setCampaign() {
      this.campaignCycle = { ...this.oldCampaignCycle };
      if (this.campaignCycle.id) {
        // get data
      }
    },
    async create() {
      try {
        const response = await this.$axios.post(
          `${this.url}`,
          {
            ...this.campaignCycle,
            campaign_id: this.currentCampaign.id
          }

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
          `${this.url}${this.campaignCycle.id}/`,
          this.campaignCycle
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
      if (this.campaignCycle.id) {
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

<template>
  <div>
    <b-button
      v-b-modal="`modal-xl-${id}`"
      :variant="variant"
      @click="setCampaign"
    >
      <b-icon icon="pencil"></b-icon>
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
            </div>
            <form ref="form" @submit.stop.prevent></form>
            <div class="row">
              <div class="col-12 col-lg-6">
                <ValidationProvider
                  v-slot="{ errors }"
                  name="Número"
                  :rules="{ required: true, numeric: true }"
                >
                  <div class="form-group">
                    <label for="number-input">Número</label>
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
                  </div>
                </ValidationProvider>
                <ValidationProvider
                  v-slot="{ errors }"
                  name="Descrição"
                  :rules="{ required: true }"
                >
                  <div class="form-group">
                    <label for="number-input">Descrição</label>
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
                  </div>
                </ValidationProvider>
                <ValidationProvider
                  v-slot="{ errors }"
                  name="Início"
                  :rules="{ required: true }"
                >
                  <div class="form-group">
                    <label for="start-input">Início</label>
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
                  </div>
                </ValidationProvider>
              </div>
              <div class="col-12 col-lg-6">
                <div class="form-group border border-success rounded p-1">
                  <label>Folha de pagamento</label>
                  <FormsSelectWorker
                    :campaign-cycle-id="cycle.id"
                    :selected-worker="cycle.payrolls"
                    list-type="payrolls"
                    :multiple="true"
                    @change="setPayrolls"
                  ></FormsSelectWorker>
                </div>
                <div class="form-group border border-success rounded p-1">
                  <label>Estatística</label>
                  <FormsSelectWorker
                    :campaign-cycle-id="cycle.id"
                    :selected-worker="cycle.statistics"
                    list-type="statistics"
                    :multiple="true"
                    @change="setStatistics"
                  ></FormsSelectWorker>
                </div>
                <div class="form-group border border-success rounded p-1">
                  <label>Apoio NUTRANS/GEZOON</label>
                  <FormsSelectWorker
                    :campaign-cycle-id="cycle.id"
                    :selected-worker="cycle.transports"
                    list-type="transports"
                    :multiple="true"
                    @change="setTransports"
                  ></FormsSelectWorker>
                </div>
                <div class="form-group border border-success rounded p-1">
                  <label>Rede de Frio</label>
                  <FormsSelectWorker
                    :campaign-cycle-id="cycle.id"
                    :selected-worker="cycle.cold_chains"
                    list-type="cold_chains"
                    :multiple="true"
                    @change="setColdChains"
                  ></FormsSelectWorker>
                </div>
              </div>
            </div>
          </b-overlay>

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
          payrolls: [],
          statistics: [],
          transports: [],
          cold_chains: []
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
        payrolls: [],
        statistics: [],
        transports: [],
        cold_chains: []
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
      if (this.cycle.id) {
        console.log(this.cycle.payrolls);
      }
    },
    async create() {
      try {
        const response = await this.$axios.post(`${this.url}`, {
          ...this.cycle,
          campaign_id: this.currentCampaign.id,
        });
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
          `${this.url}${this.cycle.id}`,
          this.cycle
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
    setPayrolls(ids) {
      this.cycle.payrolls = ids;
    },
    setStatistics(ids) {
      this.cycle.statistics = ids;
    },
    setTransports(ids) {
      this.cycle.transports = ids;
    },
    setColdChains(ids) {
      this.cycle.cold_chains = ids;
    }
  },
};
</script>

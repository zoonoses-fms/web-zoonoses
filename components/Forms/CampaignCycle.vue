<!-- eslint-disable vue/no-parsing-error -->
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
                <div class="form-group border border-success rounded p-1">
                  <label>Coordenador Estatística</label>
                  <FormsSelectWorker
                    :campaign-cycle-id="cycle.id"
                    :selected-worker="cycle.statistic_coordinator_id"
                    list-type="statistic_coordinator"
                    @change="setStatisticCoordinator"
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

                <b-card no-body class="mb-1">
                  <b-card-header header-tag="header" class="p-1" role="tab">
                    <b-button
                      :class="visibleTransports ? null : 'collapsed'"
                      :aria-expanded="visibleTransports ? 'true' : 'false'"
                      aria-controls="accordion-transports"
                      block
                      variant="success"
                      @click="visibleTransports = !visibleTransports"
                      >Apoio GETRANS</b-button
                    >
                  </b-card-header>
                  <b-collapse
                    id="accordion-transports"
                    v-model="visibleTransports"
                    accordion="accordion-transports"
                    role="tabpanel"
                  >
                    <b-card-body v-if="visibleTransports">
                      <div
                        v-for="(item, index) in datesTransports"
                        :key="`${item.name}-${index}`"
                        class="form-group border border-success rounded p-1"
                      >
                        <label>Apoio GETRANS {{ item.date }}</label>
                        <FormsSelectWorker
                          :campaign-cycle-id="cycle.id"
                          :selected-worker="cycle[item.name]"
                          :list-type="item.name"
                          :multiple="true"
                          :index="index"
                          @change="setTransports"
                        ></FormsSelectWorker>
                      </div>
                    </b-card-body>
                  </b-collapse>
                </b-card>

                <b-card no-body class="mb-1">
                  <b-card-header header-tag="header" class="p-1" role="tab">
                    <b-button
                      :class="visibleZoonoses ? null : 'collapsed'"
                      :aria-expanded="visibleZoonoses ? 'true' : 'false'"
                      aria-controls="accordion-zoonoses"
                      block
                      variant="success"
                      @click="visibleZoonoses = !visibleZoonoses"
                      >Apoio ZOONOSES
                    </b-button>
                  </b-card-header>
                  <b-collapse
                    id="accordion-zoonoses"
                    v-model="visibleZoonoses"
                    accordion="accordion-zoonoses"
                    role="tabpanel"
                  >
                    <b-card-body v-if="visibleZoonoses">
                      <div
                        v-for="(item, index) in datesZoonoses"
                        :key="`${item.name}-${index}`"
                        class="form-group border border-success rounded p-1"
                      >
                        <label>Apoio ZOONOSES {{ item.date }}</label>
                        <FormsSelectWorker
                          :campaign-cycle-id="cycle.id"
                          :selected-worker="cycle[item.name]"
                          :list-type="item.name"
                          :multiple="true"
                          :index="index"
                          @change="setZoonoses"
                        ></FormsSelectWorker>
                      </div>
                    </b-card-body>
                  </b-collapse>
                </b-card>
              </div>
              <div class="col-12 col-lg-6">
                <div class="form-group border border-success rounded p-1">
                  <label>Coordenador Rede de Frio</label>
                  <FormsSelectWorker
                    :campaign-cycle-id="cycle.id"
                    :selected-worker="cycle.cold_chain_coordinator_id"
                    list-type="cold_chain_coordinator"
                    @change="setColdChainCoordinator"
                  ></FormsSelectWorker>
                </div>
                <div class="form-group border border-success rounded p-1">
                  <label>Enfermeira Rede de Frio</label>
                  <FormsSelectWorker
                    :campaign-cycle-id="cycle.id"
                    :selected-worker="cycle.cold_chain_nurse_id"
                    list-type="cold_chain_nurse"
                    @change="setColdChainNurse"
                  ></FormsSelectWorker>
                </div>

                <b-card no-body class="mb-1">
                  <b-card-header header-tag="header" class="p-1" role="tab">
                    <b-button
                      :class="visibleDriverColdChains ? null : 'collapsed'"
                      :aria-expanded="
                        visibleDriverColdChains ? 'true' : 'false'
                      "
                      aria-controls="accordion-driver-cold-chains"
                      block
                      variant="success"
                      @click="
                        visibleDriverColdChains = !visibleDriverColdChains
                      "
                      >Motorista Rede de Frio
                    </b-button>
                  </b-card-header>
                  <b-collapse
                    id="accordion-driver-cold-chains"
                    v-model="visibleDriverColdChains"
                    accordion="accordion-driver-cold-chains"
                    role="tabpanel"
                  >
                    <b-card-body v-if="visibleDriverColdChains">
                      <div
                        v-for="(item, index) in datesDriverColdChains"
                        :key="`${item.name}-${index}`"
                        class="form-group border border-success rounded p-1"
                      >
                        <label>Motorista Rede de Frio {{ item.date }}</label>
                        <FormsSelectWorker
                          :campaign-cycle-id="cycle.id"
                          :selected-worker="cycle[item.name]"
                          :list-type="item.name"
                          :multiple="true"
                          :index="index"
                          @change="setDriverColdChains"
                        ></FormsSelectWorker>
                      </div>
                    </b-card-body>
                  </b-collapse>
                </b-card>

                <b-card no-body class="mb-1">
                  <b-card-header header-tag="header" class="p-1" role="tab">
                    <b-button
                      :class="visibleColdChains ? null : 'collapsed'"
                      :aria-expanded="
                        visibleColdChains ? 'true' : 'false'
                      "
                      aria-controls="accordion-cold-chains"
                      block
                      variant="success"
                      @click="
                        visibleColdChains = !visibleColdChains
                      "
                      >Equipe Rede de Frio
                    </b-button>
                  </b-card-header>
                  <b-collapse
                    id="accordion-cold-chains"
                    v-model="visibleColdChains"
                    accordion="accordion-cold-chains"
                    role="tabpanel"
                  >
                    <b-card-body v-if="visibleColdChains">
                      <div
                        v-for="(item, index) in datesColdChains"
                        :key="`${item.name}-${index}`"
                        class="form-group border border-success rounded p-1"
                      >
                        <label>Rede de Frio {{ item.date }}</label>
                        <FormsSelectWorker
                          :campaign-cycle-id="cycle.id"
                          :selected-worker="cycle[item.name]"
                          :list-type="item.name"
                          :multiple="true"
                          :index="index"
                          @change="setColdChains"
                        ></FormsSelectWorker>
                      </div>
                    </b-card-body>
                  </b-collapse>
                </b-card>
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
          statistic_coordinator_id: null,
          statistics: [],
          cold_chain_coordinator_id: null,
          cold_chain_nurse_id: null,
          before_driver_cold_chains: [],
          start_driver_cold_chains: [],
          before_cold_chains: [],
          start_cold_chains: [],
          before_transports: [],
          start_transports: [],
          before_zoonoses: [],
          start_zoonoses: [],
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
        statistic_coordinator_id: null,
        statistics: [],
        cold_chain_coordinator_id: null,
        cold_chain_nurse_id: null,
        before_driver_cold_chains: [],
        start_driver_cold_chains: [],
        before_cold_chains: [],
        start_cold_chains: [],
        before_transports: [],
        start_transports: [],
        before_zoonoses: [],
        start_zoonoses: [],
      },
      datesDriverColdChains: [],
      datesColdChains: [],
      datesTransports: [],
      datesZoonoses: [],
      visibleTransports: false,
      visibleZoonoses: false,
      visibleDriverColdChains: false,
      visibleColdChains: false,
    };
  },
  computed: {},
  created() {
    this.id = this.oldCampaignCycle.id;
    const start = new Date(`${this.oldCampaignCycle.start}T00:00:00`);
    const before = new Date(`${this.oldCampaignCycle.start}T00:00:00`);

    before.setDate(start.getDate() - 1);

    this.datesDriverColdChains.push({
      name: 'before_driver_cold_chains',
      date: before.toLocaleDateString('pt-BR'),
    });
    this.datesDriverColdChains.push({
      name: 'start_driver_cold_chains',
      date: start.toLocaleDateString('pt-BR'),
    });

    this.datesColdChains.push({
      name: 'before_cold_chains',
      date: before.toLocaleDateString('pt-BR'),
    });
    this.datesColdChains.push({
      name: 'start_cold_chains',
      date: start.toLocaleDateString('pt-BR'),
    });

    this.datesTransports.push({
      name: 'before_transports',
      date: before.toLocaleDateString('pt-BR'),
    });
    this.datesTransports.push({
      name: 'start_transports',
      date: start.toLocaleDateString('pt-BR'),
    });

    this.datesZoonoses.push({
      name: 'before_zoonoses',
      date: before.toLocaleDateString('pt-BR'),
    });
    this.datesZoonoses.push({
      name: 'start_zoonoses',
      date: start.toLocaleDateString('pt-BR'),
    });
  },
  methods: {
    setCampaign() {
      this.cycle = { ...this.oldCampaignCycle };
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

      const statistics = [];
      const beforeColdChains = [];
      const startColdChains = [];
      const beforeDriverColdChains = [];
      const startDriverColdChains = [];
      const beforeTransports = [];
      const startTransports = [];
      const beforeZoonoses = [];
      const startZoonoses = [];

      // before_driver_cold_chains

      this.cycle.statistics.forEach((statistic) => {
        if (typeof statistic === 'object') {
          statistics.push(statistic.id);
        }
      });

      if (statistics.length > 0) {
        this.cycle.statistics = statistics;
      }

      this.cycle.before_cold_chains.forEach((beforeColdChain) => {
        if (typeof beforeColdChain === 'object') {
          beforeColdChains.push(beforeColdChain.id);
        }
      });

      if (beforeColdChains.length > 0) {
        this.cycle.before_cold_chains = beforeColdChains;
      }

      this.cycle.start_cold_chains.forEach((startColdChain) => {
        if (typeof startColdChain === 'object') {
          startColdChains.push(startColdChain.id);
        }
      });

      if (startColdChains.length > 0) {
        this.cycle.start_cold_chains = startColdChains;
      }

      this.cycle.before_driver_cold_chains.forEach((beforeDriverColdChain) => {
        if (typeof beforeDriverColdChain === 'object') {
          beforeDriverColdChains.push(beforeDriverColdChain.id);
        }
      });

      if (beforeDriverColdChains.length > 0) {
        this.cycle.before_driver_cold_chains = beforeDriverColdChains;
      }

      this.cycle.start_driver_cold_chains.forEach((startDriverColdChain) => {
        if (typeof startDriverColdChain === 'object') {
          startDriverColdChains.push(startDriverColdChain.id);
        }
      });

      if (startDriverColdChains.length > 0) {
        this.cycle.start_driver_cold_chains = startDriverColdChains;
      }

      this.cycle.before_transports.forEach((beforeTransport) => {
        console.log(typeof beforeColdChain);
        if (typeof beforeTransport === 'object') {
          beforeTransports.push(beforeTransport.id);
        }
      });

      if (beforeTransports.length > 0) {
        this.cycle.before_transports = beforeTransports;
      }

      this.cycle.start_transports.forEach((startTransport) => {
        if (typeof startTransport === 'object') {
          startTransports.push(startTransport.id);
        }
      });

      if (startTransports.length > 0) {
        this.cycle.start_transports = startTransports;
      }

      this.cycle.before_zoonoses.forEach((beforeZoonose) => {
        if (typeof beforeZoonose === 'object') {
          beforeZoonoses.push(beforeZoonose.id);
        }
      });

      if (beforeZoonoses.length > 0) {
        this.cycle.before_zoonoses = beforeZoonoses;
      }

      this.cycle.start_zoonoses.forEach((startZoonose) => {
        if (typeof startZoonose === 'object') {
          startZoonoses.push(startZoonose.id);
        }
      });

      if (startZoonoses.length > 0) {
        this.cycle.start_zoonoses = startZoonoses;
      }

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
    setStatisticCoordinator(id) {
      this.cycle.statistic_coordinator_id = id;
    },
    setStatistics(ids) {
      this.cycle.statistics = ids;
    },
    setTransports(ids, listType) {
      if (listType === 'before_transports') {
        this.cycle.before_transports = ids;
      } else {
        this.cycle.start_transports = ids;
      }
    },
    setZoonoses(ids, listType) {
      if (listType === 'before_zoonoses') {
        this.cycle.before_zoonoses = ids;
      } else {
        this.cycle.start_zoonoses = ids;
      }
    },
    setColdChains(ids, listType) {
      if (listType === 'before_cold_chains') {
        this.cycle.before_cold_chains = ids;
      } else {
        this.cycle.start_cold_chains = ids;
      }
    },
    setColdChainCoordinator(id) {
      this.cycle.cold_chain_coordinator_id = id;
    },
    setColdChainNurse(id) {
      this.cycle.cold_chain_nurse_id = id;
    },
    setDriverColdChains(ids, listType) {
      if (listType === 'before_driver_cold_chains') {
        this.cycle.before_driver_cold_chains = ids;
      } else {
        this.cycle.start_driver_cold_chains = ids;
      }
    },
  },
};
</script>

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
                <div class="form-group border border-success rounded p-1">
                  <label>Apoio NUTRANS</label>
                  <FormsSelectWorker
                    :campaign-cycle-id="cycle.id"
                    :selected-worker="cycle.transports"
                    list-type="transports"
                    :multiple="true"
                    @change="setTransports"
                  ></FormsSelectWorker>
                </div>
                <div class="form-group border border-success rounded p-1">
                  <label>Apoio ZOONOSES</label>
                  <FormsSelectWorker
                    :campaign-cycle-id="cycle.id"
                    :selected-worker="cycle.zoonoses"
                    list-type="zoonoses"
                    :multiple="true"
                    @change="setZoonoses"
                  ></FormsSelectWorker>
                </div>
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
                <div class="form-group border border-success rounded p-1">
                  <label>Motorista Rede de Frio</label>
                  <FormsSelectWorker
                    :campaign-cycle-id="cycle.id"
                    :selected-worker="cycle.driver_cold_chains"
                    list-type="driver_cold_chains"
                    :multiple="true"
                    @change="setDriverColdChains"
                  ></FormsSelectWorker>
                </div>
                <div
                  v-for="(item, index) in datesColdChains"
                  :key="index"
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
          cold_chains: [],
          transports: [],
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
        cold_chains: [],
        transports: [],
      },
      datesColdChains: [],
    };
  },
  computed: {},
  created() {
    this.id = this.oldCampaignCycle.id;
    const start = new Date(this.oldCampaignCycle.start);
    const before = new Date(this.oldCampaignCycle.start);

    before.setDate(start.getDate() - 1);

    this.datesColdChains.push({
      name: 'before_cold_chains',
      date: before.toLocaleDateString('pt-BR'),
    });
    this.datesColdChains.push({
      name: 'start_cold_chains',
      date: start.toLocaleDateString('pt-BR'),
    });
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
    setStatisticCoordinator(id) {
      this.cycle.statistic_coordinator_id = id;
    },
    setStatistics(ids) {
      this.cycle.statistics = ids;
    },
    setTransports(ids) {
      this.cycle.transports = ids;
    },
    setZoonoses(ids) {
      this.cycle.zoonoses = ids;
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
    setDriverColdChains(ids) {
      this.cycle.driver_cold_chains = ids;
    },
  },
};
</script>

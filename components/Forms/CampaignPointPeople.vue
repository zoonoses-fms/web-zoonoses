<template>
  <div>
    <b-button
      v-b-modal="`modal-md-people-${id}`"
      :variant="variant"
      @click="showForm"
    >
      <b-icon-people></b-icon-people>
      {{ textButton }}
    </b-button>
    <ValidationObserver v-slot="{ invalid }">
      <b-modal
        :id="`modal-md-people-${id}`"
        size="md"
        scrollable
        :title="title"
        @ok="handleOk"
      >
        <b-overlay :show="show" rounded="sm">
          <div class="">
            <div class="row pb-1">
              <div class="col-8">
                <div class="form-group border border-success rounded p-1">
                  <label>Ponto de Apoio</label>
                  <b-input-group>
                    <b-form-select
                      v-model="point.campaing_support_id"
                      :disabled="isDisabled"
                    >
                      <b-form-select-option
                        v-for="support in supports"
                        :key="support.id"
                        :value="support.id"
                      >
                        {{ support.support.name }}
                      </b-form-select-option>
                    </b-form-select>
                    <b-input-group-append>
                      <b-button
                        variant="success"
                        @click="
                          () => {
                            isDisabled = !isDisabled;
                          }
                        "
                        >Editar</b-button
                      >
                    </b-input-group-append>
                  </b-input-group>
                </div>
              </div>

              <div class="col-4">
                <NuxtLink
                  to="/ncrlo/vaccination/worker"
                  class="btn btn-success btn-block p-0"
                >
                  Lista da equipe
                </NuxtLink>
              </div>
            </div>

            <form ref="form" @submit.stop.prevent>
              <div class="row">
                <div class="col-12">
                  <div class="form-group border border-success rounded p-1">
                    <div class="form-row">
                      <div class="col-12 col-md-6">
                        <label for="order-input">Ordem:</label>
                        <input
                          v-model="point.order"
                          name="order-input"
                          class="form-control form-control-sm"
                          type="number"
                        />
                      </div>
                      <div class="col-12 col-md-6">
                        <label for="area-input">Área:</label>
                        <input
                          v-model="point.area"
                          name="area-input"
                          class="form-control form-control-sm"
                          type="number"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="form-group border border-success rounded p-1">
                    <label>Selecione o Supervisor</label>
                    <FormsSelectWorker
                      :campaign-cycle-id="campaignCycleId"
                      :selected-worker="point.supervisor_id"
                      list-type="supervisor"
                      :pre-loading-list="supervisors"
                      @change="setSupervisor"
                    ></FormsSelectWorker>
                  </div>
                  <div class="form-group border border-success rounded p-1">
                    <label>Selecione os Vacinadores</label>
                    <FormsSelectWorker
                      :campaign-cycle-id="campaignCycleId"
                      :selected-worker="point.vaccinators"
                      list-type="vaccinators"
                      :multiple="true"
                      @change="setVaccinators"
                    ></FormsSelectWorker>
                  </div>
                  <div class="form-group border border-success rounded p-1">
                    <label>Selecione os Anotadores</label>
                    <FormsSelectWorker
                      :campaign-cycle-id="campaignCycleId"
                      :selected-worker="point.annotators"
                      list-type="annotators"
                      :multiple="true"
                      @change="setAnnotators"
                    ></FormsSelectWorker>
                  </div>
                </div>
              </div>
            </form>
            <div class="footerform"></div>
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
    oldPoint: {
      type: Object,
      default() {
        return {
          id: null,
          campaing_support_id: null,
          vaccination_point_id: null,
          supervisor_id: null,
          order: null,
          area: null,
          goal: null,
          male_dog_under_4m: null,
          female_dog_under_4m: null,
          male_dog_major_4m_under_1y: null,
          female_dog_major_4m_under_1y: null,
          male_dog_major_1y_under_2y: null,
          female_dog_major_1y_under_2y: null,
          male_dog_major_2y_under_4y: null,
          female_dog_major_2y_under_4y: null,
          male_dog_major_4y: null,
          female_dog_major_4y: null,
          male_dogs: null,
          female_dogs: null,
          total_of_dogs: null,
          male_cat: null,
          female_cat: null,
          total_of_cats: null,
          total: null,
          bottle_received: null,
          bottle_used_completely: null,
          bottle_used_partially: null,
          bottle_returned_completely: null,
          bottle_returned_partially: null,
          bottle_lost: null,
          vaccinators: [],
          annotators: [],
        };
      },
    },
    supervisors: {
      type: Array,
      default() {
        return [];
      },
    },
    campaignCycleId: {
      type: [String, Number],
      required: true,
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
      url: 'ncrlo/campaign/point/',
      urlSupport: 'ncrlo/campaign/support/',
      isDisabled: true,
      point: {
        type: Object,
        default() {
          return {
            id: null,
            campaing_support_id: null,
            vaccination_point_id: null,
            supervisor_id: null,
            order: null,
            area: null,
            goal: null,
            male_dog_under_4m: null,
            female_dog_under_4m: null,
            male_dog_major_4m_under_1y: null,
            female_dog_major_4m_under_1y: null,
            male_dog_major_1y_under_2y: null,
            female_dog_major_1y_under_2y: null,
            male_dog_major_2y_under_4y: null,
            female_dog_major_2y_under_4y: null,
            male_dog_major_4y: null,
            female_dog_major_4y: null,
            male_dogs: null,
            female_dogs: null,
            total_of_dogs: null,
            male_cat: null,
            female_cat: null,
            total_of_cats: null,
            total: null,
            bottle_received: null,
            bottle_used_completely: null,
            bottle_used_partially: null,
            bottle_returned_completely: null,
            bottle_returned_partially: null,
            bottle_lost: null,
            vaccinators: [],
            annotators: [],
          };
        },
      },
      supports: [],
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
    this.id = this.oldPoint.id;
  },
  methods: {
    showForm() {
      this.point = { ...this.oldPoint };
      this.getSupports();
    },
    handleOk() {
      this.show = true;
      if (this.point.id) {
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
        const response = await this.$axios.post(`${this.url}`, this.point);
        this.point = response.data;
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
          `${this.url}${this.point.id}/`,
          this.point
        );
        this.point = response.data;
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
    setSupervisor(id) {
      this.point.supervisor_id = id;
    },
    setVaccinators(ids) {
      this.point.vaccinators = ids;
    },
    setAnnotators(ids) {
      this.point.annotators = ids;
    },
    async getSupports() {
      const supports = await this.$axios.get(`${this.urlSupport}`, {
        params: {
          campaing_support_id: this.point.campaing_support_id,
        },
      });
      this.supports = supports.data;
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

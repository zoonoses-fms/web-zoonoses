<!-- eslint-disable vue/no-template-shadow -->
<template>
  <div>
    <b-button
      v-b-modal="`modal-xl-people-${id}`"
      :variant="variant"
      @click="showForm"
    >
      <b-icon-people></b-icon-people>
      {{ textButton }}
    </b-button>
    <ValidationObserver v-slot="{ invalid }">
      <b-modal
        :id="`modal-xl-people-${id}`"
        size="xl"
        scrollable
        :title="title"
        @ok="handleOk"
      >
        <b-overlay :show="show" rounded="sm">
          <div class="container-fluid">
            <div class="row pb-1">
              <div class="col-8">
                <div class="form-group border border-success rounded p-1">
                  <label>Ponto de Apoio</label>
                  <b-input-group>
                    <b-form-select
                    v-model="point.campaign_support_id"
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
                </div>
              </div>

              <FormsSelectProfiles
                v-if="!support.is_rural"
                v-model="point.profiles"
                :pre-list-worker="preListWorker"
                :date="cycle.start"
              />
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
    cycle: {
      type: Object,
      required: true,
    },
    support: {
      type: Object,
      required: true,
    },
    oldPoint: {
      type: Object,
      default() {
        return {
          id: null,
         campaign_support_id: null,
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
            campaign_support_id: null,
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
  computed: {
    preListWorker() {
      const profiles = this.support.profiles.filter((profile) => {
        return profile.is_supervisor === true;
      });
      if (profiles.length > 0) {
        return profiles[0].workers;
      }
      return [];
    },
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
        await this.$axios.post(`${this.url}`, this.point);
        this.$emit('input', { status: 'create' });
      } catch (errors) {
        this.$emit('input', { status: 'errors', errors });
        this.show = false;
      }
    },
    async update() {
      try {
        await this.$axios.put(`${this.url}${this.point.id}/`, this.point);
        this.$emit('input', { status: 'update' });
      } catch (errors) {
        this.$emit('input', { status: 'errors', errors });
        this.show = false;
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
         campaign_support_id: this.point.campaign_support_id,
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

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
        :title="title"
        @ok="handleOk"
      >
        <b-overlay :show="show" rounded="sm">
          <div class="">
            <form ref="form" @submit.stop.prevent></form>
            <div class="row">
              <div class="col-12 col-lg-6">
                <div class="form-group border border-success rounded p-1">
                  <div class="form-row">
                    <div class="col-12 col-md-6 col-lg-3">
                      <label for="goal-input">Meta:</label>
                      <input
                        v-model="point.goal"
                        name="goal-input"
                        class="form-control form-control-sm"
                        type="number"
                      />
                    </div>
                    <div class="col-12 col-md-6 col-lg-3">
                      <label for="total-input">Total:</label>
                      <input
                        v-model="point.total"
                        name="total-input"
                        class="form-control form-control-sm"
                        type="text"
                        disabled
                      />
                    </div>
                    <div class="col-12 col-md-6 col-lg-3">
                      <label for="total-of-dogs-input">Cachorros:</label>
                      <input
                        v-model="point.total_of_dogs"
                        name="total-of-dogs-input"
                        class="form-control form-control-sm"
                        type="text"
                        disabled
                      />
                    </div>
                    <div class="col-12 col-md-6 col-lg-3">
                      <label for="total-of-cats-input">Gatos:</label>
                      <input
                        v-model="point.total_of_cats"
                        name="total-of-cats-input"
                        class="form-control form-control-sm"
                        type="text"
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div class="form-group border border-success rounded p-1">
                  <label>Cachorros:</label>
                  <div class="form-group border border-success rounded p-1">
                    <label>Macho:</label>
                    <div class="col-12 form-row mb-1">
                      <div class="col-12 col-md-6 col-lg-3">
                        <label for="male-dog-under-4m-input">&lt; 4m:</label>
                        <input
                          v-model="point.male_dog_under_4m"
                          name="male-dog-under-4m-input"
                          class="form-control form-control-sm"
                          type="number"
                        />
                      </div>
                      <div class="col-12 col-md-6 col-lg-3">
                        <label for="male-dog-major-4m-under-1y-input"
                          >4m &lt; 1A:</label
                        >
                        <input
                          v-model="point.male_dog_major_4m_under_1y"
                          name="male-dog-major-4m-under-1y-input"
                          class="form-control form-control-sm"
                          type="number"
                        />
                      </div>
                      <div class="col-12 col-md-6 col-lg-3">
                        <label for="male-dog-major-1y-under-2y-input"
                          >1A &lt; 2A:</label
                        >
                        <input
                          v-model="point.male_dog_major_1y_under_2y"
                          name="male-dog-major-1y-under-2y-input"
                          class="form-control form-control-sm"
                          type="number"
                        />
                      </div>
                      <div class="col-12 col-md-6 col-lg-3">
                        <label for="male-dog-major-2y-under-4y-input"
                          >1A &lt; 2A:</label
                        >
                        <input
                          v-model="point.male_dog_major_2y_under_4y"
                          name="male-dog-major-2y-under-4y-input"
                          class="form-control form-control-sm"
                          type="number"
                        />
                      </div>
                      <div class="col-12 col-md-6 col-lg-3">
                        <label for="male_dog_major_4y-input">&gt; 4A:</label>
                        <input
                          v-model="point.male_dog_major_4y"
                          name="male_dog_major_4y-input"
                          class="form-control form-control-sm"
                          type="number"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="form-group border border-success rounded p-1">
                    <label>Fêmea:</label>
                    <div class="col-12 form-row mb-1">
                      <div class="col-12 col-md-6 col-lg-3">
                        <label for="female-dog-under-4m-input">&lt; 4m:</label>
                        <input
                          v-model="point.female_dog_under_4m"
                          name="female-dog-under-4m-input"
                          class="form-control form-control-sm"
                          type="number"
                        />
                      </div>
                      <div class="col-12 col-md-6 col-lg-3">
                        <label for="female-dog-major-4m-under-1y-input"
                          >4m &lt; 1A:</label
                        >
                        <input
                          v-model="point.female_dog_major_4m_under_1y"
                          name="female-dog-major-4m-under-1y-input"
                          class="form-control form-control-sm"
                          type="number"
                        />
                      </div>
                      <div class="col-12 col-md-6 col-lg-3">
                        <label for="female-dog-major-1y-under-2y-input"
                          >1A &lt; 2A:</label
                        >
                        <input
                          v-model="point.female_dog_major_1y_under_2y"
                          name="female-dog-major-1y-under-2y-input"
                          class="form-control form-control-sm"
                          type="number"
                        />
                      </div>
                      <div class="col-12 col-md-6 col-lg-3">
                        <label for="female-dog-major-2y-under-4y-input"
                          >1A &lt; 2A:</label
                        >
                        <input
                          v-model="point.female_dog_major_2y_under_4y"
                          name="female-dog-major-2y-under-4y-input"
                          class="form-control form-control-sm"
                          type="number"
                        />
                      </div>
                      <div class="col-12 col-md-6 col-lg-3">
                        <label for="female_dog_major_4y-input">&gt; 4A:</label>
                        <input
                          v-model="point.female_dog_major_4y"
                          name="female-dog-major-4y-input"
                          class="form-control form-control-sm"
                          type="number"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12 col-lg-6">
                <div class="form-group border border-success rounded p-1 w-100">
                  <label>Gatos:</label>
                  <div class="form-row mb-1">
                    <div class="col-12 col-md-6">
                      <div class="form-group border border-success rounded p-1">
                        <label>Macho:</label>
                        <input
                          v-model="point.male_cat"
                          name="male-cat-input"
                          class="form-control form-control-sm"
                          type="number"
                        />
                      </div>
                    </div>
                    <div class="col-12 col-md-6">
                      <div class="form-group border border-success rounded p-1">
                        <label>Fêmea:</label>
                        <input
                          v-model="point.female_cat"
                          name="female-cat-input"
                          class="form-control form-control-sm"
                          type="number"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group border border-success rounded p-1 w-100">
                  <label>Frascos</label>
                  <div class="form-row">
                    <div class="col-12 col-md-6">
                      <label for="bottle-received-input">Recebidos:</label>
                      <input
                        v-model="point.bottle_received"
                        name="bottle-received-input"
                        class="form-control form-control-sm"
                        type="number"
                      />
                    </div>
                    <div class="col-12 col-md-6">
                      <label for="bottle-used-completely-input"
                        >Uso completo:</label
                      >
                      <input
                        v-model="point.bottle_used_completely"
                        name="bottle-used-completely-input"
                        class="form-control form-control-sm"
                        type="number"
                      />
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="col-12 col-md-6">
                      <label for="bottle-used-partially-input"
                        >Uso parcial:</label
                      >
                      <input
                        v-model="point.bottle_used_partially"
                        name="bottle-used-partially-input"
                        class="form-control form-control-sm"
                        type="number"
                      />
                    </div>
                    <div class="col-12 col-md-6">
                      <label for="bottle-returned-completely-input"
                        >Devolução completa:</label
                      >
                      <input
                        v-model="point.bottle_returned_completely"
                        name="bottle-returned-completely-input"
                        class="form-control form-control-sm"
                        type="number"
                      />
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="col-12 col-md-6">
                      <label for="bottle-returned-partially-input"
                        >Devolução parcial:</label
                      >
                      <input
                        v-model="point.bottle_returned_partially"
                        name="bottle-returned-partially-input"
                        class="form-control form-control-sm"
                        type="number"
                      />
                    </div>
                    <div class="col-12 col-md-6">
                      <label for="bottle-lost-input">Extraviados:</label>
                      <input
                        v-model="point.bottle_lost"
                        name="bottle-lost-input"
                        class="form-control form-control-sm"
                        type="number"
                      />
                    </div>
                  </div>
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
  watch: {
    'point.male_dog_under_4m'() {
      this.calcMaleDogs();
    },
    'point.male_dog_major_4m_under_1y'() {
      this.calcMaleDogs();
    },
    'point.male_dog_major_1y_under_2y'() {
      this.calcMaleDogs();
    },
    'point.male_dog_major_2y_under_4y'() {
      this.calcMaleDogs();
    },
    'point.male_dog_major_4y'() {
      this.calcMaleDogs();
    },
    'point.female_dog_under_4m'() {
      this.calcFemaleDogs();
    },
    'point.female_dog_major_4m_under_1y'() {
      this.calcFemaleDogs();
    },
    'point.female_dog_major_1y_under_2y'() {
      this.calcFemaleDogs();
    },
    'point.female_dog_major_2y_under_4y'() {
      this.calcFemaleDogs();
    },
    'point.female_dog_major_4y'() {
      this.calcFemaleDogs();
    },
    'point.male_dogs'() {
      this.calcTotalDogs();
    },
    'point.female_dogs'() {
      this.calcTotalDogs();
    },
    'point.total_of_dogs'() {
      this.calcTotal();
    },
    'point.total_of_cats'() {
      this.calcTotal();
    },
    'point.male_cat'() {
      this.calcTotalCats();
    },
    'point.female_cat'() {
      this.calcTotalCats();
    },
    deep: true,
  },
  created() {
    this.id = this.oldPoint.id;
  },
  methods: {
    showForm() {
      this.point = { ...this.oldPoint };
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
    calcMaleDogs() {
      let total = 0;
      total +=
        this.point.male_dog_under_4m !== null
          ? +this.point.male_dog_under_4m
          : 0;
      total +=
        this.point.male_dog_major_4m_under_1y !== null
          ? +this.point.male_dog_major_4m_under_1y
          : 0;
      total +=
        this.point.male_dog_major_1y_under_2y !== null
          ? +this.point.male_dog_major_1y_under_2y
          : 0;
      total +=
        this.point.male_dog_major_2y_under_4y !== null
          ? +this.point.male_dog_major_2y_under_4y
          : 0;
      total +=
        this.point.male_dog_major_4y !== null
          ? +this.point.male_dog_major_4y
          : 0;
      this.point.male_dogs = total;
    },
    calcFemaleDogs() {
      let total = 0;
      total +=
        this.point.female_dog_under_4m !== null
          ? +this.point.female_dog_under_4m
          : 0;
      total +=
        this.point.female_dog_major_4m_under_1y !== null
          ? +this.point.female_dog_major_4m_under_1y
          : 0;
      total +=
        this.point.female_dog_major_1y_under_2y !== null
          ? +this.point.female_dog_major_1y_under_2y
          : 0;
      total +=
        this.point.female_dog_major_2y_under_4y !== null
          ? +this.point.female_dog_major_2y_under_4y
          : 0;
      total +=
        this.point.female_dog_major_4y !== null
          ? +this.point.female_dog_major_4y
          : 0;
      this.point.female_dogs = total;
    },
    calcTotalDogs() {
      let total = 0;
      total += this.point.male_dogs !== null ? +this.point.male_dogs : 0;
      total += this.point.female_dogs !== null ? +this.point.female_dogs : 0;
      this.point.total_of_dogs = total;
    },
    calcTotal() {
      let total = 0;
      total +=
        this.point.total_of_dogs !== null ? +this.point.total_of_dogs : 0;
      total +=
        this.point.total_of_cats !== null ? +this.point.total_of_cats : 0;
      this.point.total = total;
    },
    calcTotalCats() {
      let total = 0;
      total += this.point.male_cat !== null ? +this.point.male_cat : 0;
      total += this.point.female_cat !== null ? +this.point.female_cat : 0;
      this.point.total_of_cats = total;
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

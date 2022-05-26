<template>
  <div style="width: max-content; display: inline-block" class="m-0 p-0">
    <b-button block size="sm" class="m-0" :variant="variant" @click="showForm">
      <slot />
    </b-button>
    <b-overlay :show="show" rounded="sm">
      <div class="container">
        <ValidationObserver v-slot="{ invalid }">
          <b-modal
            :id="`modal-lg-form-${form.id}`"
            :ref="`modal-lg-form-${form.id}`"
            size="lg"
            scrollable
            :title="`${title} ${form.number}`"
            @ok="handleOk"
          >
            <form ref="form" @submit.stop.prevent>
              <div class="row">
                <div class="col-4">
                  <b-form-group label="Número da fichas:">
                    <b-form-input
                      v-model="form.number"
                      name="form-number"
                      type="text"
                      placeholder="Número da ficha"
                    >
                    </b-form-input>
                  </b-form-group>
                </div>
                <div class="col-4">
                  <validation-provider
                    v-slot="validationContext"
                    name="Data"
                    :rules="{ required: true }"
                  >
                    <b-form-group :label="`Data do ${eventName}`">
                      <b-form-input
                        v-model="form.event_date"
                        name="form-event_date"
                        :state="getValidationState(validationContext)"
                        aria-describedby="form-event_date-feedback"
                        type="date"
                      ></b-form-input>
                      <b-form-invalid-feedback id="form-event_date-feedback">{{
                        validationContext.errors[0]
                      }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </div>
                <div class="col-4">
                  <validation-provider
                    v-slot="validationContext"
                    name="Data"
                    :rules="{ required: true }"
                  >
                    <b-form-group label="Data do recebimento">
                      <b-form-input
                        v-model="form.receipt_date"
                        name="form-receipt_date"
                        :state="getValidationState(validationContext)"
                        aria-describedby="form-receipt_date-feedback"
                        type="date"
                      ></b-form-input>
                      <b-form-invalid-feedback
                        id="form-receipt_date-feedback"
                        >{{
                          validationContext.errors[0]
                        }}</b-form-invalid-feedback
                      >
                    </b-form-group>
                  </validation-provider>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <validation-provider
                    v-slot="validationContext"
                    name="Nome"
                    :rules="{ required: true, min: 3 }"
                  >
                    <b-form-group label="Nome:">
                      <b-form-input
                        v-model="form.name"
                        name="form-name"
                        type="text"
                        :state="getValidationState(validationContext)"
                        placeholder="Nome"
                        aria-describedby="form-name-feedback"
                      >
                      </b-form-input>
                      <b-form-invalid-feedback id="form-name-feedback">{{
                        validationContext.errors[0]
                      }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <label>Unidade de devolução</label>
                  <autocomplete
                    :search="search"
                    :get-result-value="getResultValue"
                    placeholder="Nome fantasia/CNES"
                    aria-label="Nome fantasia/CNES"
                    @submit="handleSelect"
                  ></autocomplete>
                </div>
              </div>
              <div class="row justify-content-center align-items-center">
                <div class="col-4">
                  {{ healthUnit.cnes_code }}
                </div>
                <div class="col-8">
                  {{ healthUnit.alias_company_name }}
                </div>
              </div>
              <div class="row justify-content-center align-items-center">
                <div class="col-6">
                  {{ healthUnit.address }}
                </div>
                <div class="col-1">
                  {{ healthUnit.address_number }}
                </div>
                <div class="col-5">
                  {{ healthUnit.neighborhood }}
                </div>
              </div>
              <div class="clearfix"></div>
            </form>
            <template #modal-footer="{ ok, cancel }">
              <button
                :disabled="invalid"
                class="btn btn-success btn-sm"
                @click="ok()"
              >
                Salvar
              </button>
              <b-button size="sm" variant="danger" @click="cancel()">
                Cancelar
              </b-button>
            </template>
          </b-modal>
        </ValidationObserver>
      </div>
    </b-overlay>
  </div>
</template>
<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate';
export default {
  name: 'FormsReceivement',
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
    url: {
      type: String,
      default: '',
    },
    iconButton: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    variant: {
      type: String,
      default: 'primary',
    },
    eventName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      form: {
        id: null,
        number: null,
        name: null,
        start: null,
        end: null,
        event_date: null,
        receipt_date: null,
        range_number_start: null,
        range_number_end: null,
        cnes_code: null,
        cnes_code_devolution: null,
      },
      moves: [],
      show: false,
      user: this.$store.state.auth.user,
      groupOptions: [].length,
      healthUnit: {
        cnes_code: null,
        alias_company_name: null,
        address: null,
        address_number: null,
        neighborhood: null,
      },
    };
  },
  created() {
    if (this.item) {
      this.form = Object.assign({}, this.item);
    }
  },
  mounted() {},
  methods: {
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    showForm() {
      try {
        const modal = `modal-lg-form-${this.form.id}`;
        this.$refs[modal].show();
      } catch (error) {
        console.error(error);
      }
    },
    async deleteMove(id) {
      try {
        await this.$axios.delete(`${this.url}${id}/`);
        this.getServices();
      } catch (error) {
        console.error(error);
      }
    },
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.show = true;
      this.handleSubmit();
    },
    handleSubmit() {
      this.updateForm();
      this.$nextTick(() => {
        this.$bvModal.hide(`modal-lg-form-${this.form.id}`);
      });
    },
    async updateForm() {
      this.form.status = 3;
      console.log(this.form);
      try {
        const response = await this.$axios.put(`${this.url}`, this.form);

        this.$emit('addForm', { addForm: response.data });
        this.$bvToast.toast('Criado!', {
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
    async search(input) {
      try {
        if (input.length < 3) {
          return [];
        }
        const result = await this.$axios.get(`health_unit/?search=${input}`);

        return result.data;
      } catch (e) {
        await this.$store.dispatch('alerts/error', e);
      }
    },
    getResultValue(result) {
      return result.alias_company_name;
    },
    async handleSelect(result) {
      try {
        const response = await this.$axios.get(
          `health_unit/?cnes_code=${result.cnes_code}`
        );
        this.healthUnit = response.data[0];
        this.form.cnes_code_devolution = this.healthUnit.cnes_code;
      } catch (e) {
        await this.$store.dispatch('alerts/error', e);
      }
    },
  },
};
</script>
<style lang="scss">
.autocomplete-result-list {
  background-color: rgba(248, 248, 248, 1);
  z-index: 1000 !important;
}
.modal-dialog {
  height: 100%;
}
.modal-content {
  height: 100%;
}
.modal-dialog {
  max-height: 100%;
}
</style>

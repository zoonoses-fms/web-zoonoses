<template>
  <div style="width: max-content; display: inline-block" class="m-0 p-0">
    <b-button
      v-b-tooltip.hover
      block
      :variant="variant"
      title="Enviar"
      @click="showForm"
    >
      <b-icon :icon="iconButton" />
    </b-button>
    <b-overlay :show="show" rounded="sm">
      <div class="container">
        <ValidationObserver v-slot="{ invalid }">
          <b-modal
            :id="`modal-lg-form-${form.id}`"
            :ref="`modal-lg-form-${form.id}`"
            size="lg"
            scrollable
            :title="title"
            @ok="handleOk"
          >
            <form ref="form" @submit.stop.prevent>
              <div v-if="type != 'input'" class="row mt-2 mb-2">
                <div class="col-12">
                  <autocomplete
                    :search="search"
                    :get-result-value="getResultValue"
                    placeholder="Nome fantasia/CNES"
                    aria-label="Nome fantasia/CNES"
                    @submit="handleSelect"
                  ></autocomplete>
                </div>
              </div>
              <div
                class="row justify-content-center align-items-center mt-2 mb-2"
              >
                <div class="col-4">
                  {{ healthUnit.cnes_code }}
                </div>
                <div class="col-8">
                  {{ healthUnit.alias_company_name }}
                </div>
              </div>
              <div
                class="row justify-content-center align-items-center mt-2 mb-2"
              >
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
              <div class="row">
                <div class="col-6">
                  <validation-provider
                    v-slot="validationContext"
                    name="Numéro inicial"
                    :rules="{ required: true, min: 3 }"
                  >
                    <b-form-group label="Numéro inicial:">
                      <b-form-input
                        id="form-start"
                        v-model="form.start"
                        name="form-start"
                        type="text"
                        :state="getValidationState(validationContext)"
                        placeholder="Número Inicial"
                        aria-describedby="form-start-feedback"
                      >
                      </b-form-input>
                      <b-form-invalid-feedback id="form-start-feedback">{{
                        validationContext.errors[0]
                      }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </div>
                <div class="col-6">
                  <b-form-group label="Quantidade:">
                    <b-form-input
                      id="quant"
                      v-model="quant"
                      name="quant"
                      type="text"
                      placeholder="Quantidade"
                    >
                    </b-form-input>
                  </b-form-group>
                </div>
              </div>
              <div class="row">
                <div v-if="!form.id" class="col-6">
                  <b-form-group label="Numéro final:">
                    <b-form-input
                      id="form-end"
                      v-model="form.end"
                      name="form-end"
                      type="text"
                      placeholder="Número Final"
                      :disabled="true"
                    >
                    </b-form-input>
                  </b-form-group>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <validation-provider
                    v-slot="validationContext"
                    name="Responsavel"
                    :rules="{ required: true, min: 3 }"
                  >
                    <b-form-group label="Nome do responsavel:">
                      <b-form-input
                        v-model="form.responsible"
                        name="form-responsible"
                        type="text"
                        :state="getValidationState(validationContext)"
                        placeholder="Nome do responsavel"
                        aria-describedby="form-responsible-feedback"
                      >
                      </b-form-input>
                      <b-form-invalid-feedback id="form-responsible-feedback">{{
                        validationContext.errors[0]
                      }}</b-form-invalid-feedback>
                    </b-form-group>
                  </validation-provider>
                </div>
              </div>
              <div class="clearfix"></div>
            </form>
            <template #modal-footer="{ ok, cancel }">
              <button
                class="btn btn-success btn-sm"
                :disabled="invalid"
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
  name: 'FormsSend',
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  props: {
    item: {
      type: Object,
      default() {
        return {
          id: null,
          number: null,
          name: null,
          start: null,
          end: null,
          event_date: null,
          range_number_start: null,
          range_number_end: null,
          cnes_code: null,
          cnes_code_devolution: null,
          responsible: null,
        };
      },
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
        range_number_start: null,
        range_number_end: null,
        cnes_code: null,
        cnes_code_devolution: null,
        responsible: null,
      },
      quant: null,
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
  watch: {
    quant(val) {
      if (val > 1) {
        this.form.end = Number(this.form.start) + Number(val) - 1;
      } else {
        this.form.end = null;
      }
    },
  },
  created() {
    if (this.item) {
      this.form = Object.assign({}, this.item);
    }
  },
  async mounted() {},
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
        const lastSend = await this.$axios.get(
          `${this.url}last-send/${result.cnes_code}`
        );

        this.form.responsible = lastSend.data.responsible;
        this.form.cnes_code = this.healthUnit.cnes_code;
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

<template>
  <div style="width: max-content; display: inline-block" class="m-0 p-0">
    <b-button
      v-b-tooltip.hover
      block
      :variant="variant"
      title="Receber"
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
                <div class="col-6">
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
  name: 'FormsAdd',
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
  mounted: async () => {},
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
      this.createForm();
      this.$nextTick(() => {
        this.$bvModal.hide(`modal-lg-form-${this.form.id}`);
      });
    },
    async createForm() {
      try {
        const response = await this.$axios.post(`${this.url}`, this.form);

        this.$emit('addForm', { addForm: response.data });
        this.$bvToast.toast('Criado!', {
          title: 'Sucesso',
          autoHideDelay: 5000,
          variant: 'success',
          solid: true,
        });
        this.show = false;
        this.form = {
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
        };
        this.quant = null;
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
  },
};
</script>
<style lang="scss"></style>

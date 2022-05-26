<template>
  <div style="width: max-content; display: inline-block" class="m-0 p-0">
    <b-button block :variant="variant" @click="showForm">
      <b-icon :icon="iconButton" />
    </b-button>
    <b-overlay :show="show" rounded="sm">
      <div class="container">
        <ValidationObserver v-slot="{ invalid }">
          <b-modal
            :id="`modal-lg-form-${healthUnit.id}`"
            :ref="`modal-lg-form-${healthUnit.id}`"
            size="lg"
            scrollable
            :title="title"
            @ok="handleOk"
          >
            <form ref="form" @submit.stop.prevent>
              <div class="row">
                <div class="col-6">
                  <b-form-group label="Código da unidade:">
                    <b-form-input
                      id="unit_code"
                      v-model="healthUnit.unit_code"
                      name="unit_code"
                      type="text"
                      disabled
                      placeholder="Código da unidade"
                    >
                    </b-form-input>
                  </b-form-group>
                </div>
                <div class="col-6">
                  <ValidationProvider
                    v-slot="validationContext"
                    name="CNES:"
                    :rules="{ required: true, min: 7 }"
                  >
                    <b-form-group label="CNES">
                      <b-form-input
                        id="cnes_code"
                        v-model="healthUnit.cnes_code"
                        name="cnes_code"
                        type="text"
                        :state="getValidationState(validationContext)"
                        placeholder="CNES"
                        aria-describedby="form-start-feedback"
                      >
                      </b-form-input>
                      <b-form-invalid-feedback id="form-start-feedback">{{
                        validationContext.errors[0]
                      }}</b-form-invalid-feedback>
                    </b-form-group>
                  </ValidationProvider>
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <b-form-group label="CNPJ do Mantenedor:">
                    <input
                      id="cnpj_maintainer_code"
                      v-model="healthUnit.cnpj_maintainer_code"
                      v-mask="'##.###.###/####-##'"
                      class="form-control"
                      name="cnpj_maintainer_code"
                      type="text"
                      placeholder="CNPJ do Mantenedor"
                    />
                  </b-form-group>
                </div>
                <div class="col-6">
                  <b-form-group label="Nome do Mantenedor:">
                    <b-form-input
                      id="company_name"
                      v-model="healthUnit.company_name"
                      name="company_name"
                      type="text"
                      placeholder="Nome do Mantenedor"
                    >
                    </b-form-input>
                  </b-form-group>
                </div>
              </div>
              <div class="row">
                <div class="col-12">
                  <ValidationProvider
                    v-slot="validationContext"
                    name="Nome:"
                    :rules="{ required: true, min: 7 }"
                  >
                    <b-form-group label="Nome">
                      <b-form-input
                        id="alias_company_name"
                        v-model="healthUnit.alias_company_name"
                        name="alias_company_name"
                        type="text"
                        :state="getValidationState(validationContext)"
                        placeholder="Nome"
                        aria-describedby="form-start-feedback"
                      >
                      </b-form-input>
                      <b-form-invalid-feedback id="form-start-feedback">{{
                        validationContext.errors[0]
                      }}</b-form-invalid-feedback>
                    </b-form-group>
                  </ValidationProvider>
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <b-form-group label="Endereço:">
                    <b-form-input
                      id="address"
                      v-model="healthUnit.address"
                      name="address"
                      type="text"
                      placeholder="Endereço"
                    >
                    </b-form-input>
                  </b-form-group>
                </div>
                <div class="col-2">
                  <b-form-group label="Número:">
                    <b-form-input
                      id="address_number"
                      v-model="healthUnit.address_number"
                      name="address_number"
                      type="text"
                      placeholder="Número"
                    >
                    </b-form-input>
                  </b-form-group>
                </div>
                <div class="col-4">
                  <b-form-group label="Complemento:">
                    <b-form-input
                      id="address_complement"
                      v-model="healthUnit.address_complement"
                      name="address_complement"
                      type="text"
                      placeholder="Complemento"
                    >
                    </b-form-input>
                  </b-form-group>
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <b-form-group label="Bairro:">
                    <b-form-input
                      id="neighborhood"
                      v-model="healthUnit.neighborhood"
                      name="neighborhood"
                      type="text"
                      placeholder="Bairro"
                    >
                    </b-form-input>
                  </b-form-group>
                </div>
                <div class="col-6">
                  <b-form-group label="CEP:">
                    <b-form-input
                      id="cep_code"
                      v-model="healthUnit.cep_code"
                      name="cep_code"
                      type="text"
                      placeholder="CEP"
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
  name: 'FormsAddHealthUnit',
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
          unit_code: null,
          cnes_code: null,
          cnpj_maintainer_code: null,
          company_name: null,
          alias_company_name: null,
          company_type: null,
          ibge_state_id: 22,
          ibge_city_id: 221100,
          address: null,
          address_number: null,
          address_complement: null,
          neighborhood: null,
          cep_code: null,
        };
      },
    },
    url: {
      type: String,
      required: true,
    },
    iconButton: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    variant: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      healthUnit: {
        id: null,
        unit_code: null,
        cnes_code: null,
        cnpj_maintainer_code: null,
        company_name: null,
        alias_company_name: null,
        company_type: null,
        ibge_state_id: 22,
        ibge_city_id: 221100,
        address: null,
        address_number: null,
        address_complement: null,
        neighborhood: null,
        cep_code: null,
      },
      quant: null,
      moves: [],
      show: false,
      user: this.$store.state.auth.user,
      groupOptions: [].length,
    };
  },
  watch: {
    'healthUnit.cnes_code'(val) {
      this.healthUnit.unit_code = `221100${val}`;
    },
  },
  created() {
    if (this.item) {
      this.healthUnit = Object.assign({}, this.item);
    }
  },
  asyncmounted() {},
  methods: {
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    showForm() {
      try {
        const modal = `modal-lg-form-${this.healthUnit.id}`;
        this.$refs[modal].show();
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
    async deleteMove(id) {
      try {
        await this.$axios.delete(`${this.url}${id}/`);
        this.getServices();
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
    handleOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.show = true;
      this.handleSubmit();
    },
    handleSubmit() {
      this.healthUnit.cnpj_maintainer_code =
        this.healthUnit.cnpj_maintainer_code.replace(/[^\d]+/g, '');
      if (this.healthUnit.id === null) {
        this.createForm();
      } else {
        this.updateForm();
      }

      this.$nextTick(() => {
        this.$bvModal.hide(`modal-lg-form-${this.healthUnit.id}`);
      });
    },
    async createForm() {
      try {
        const response = await this.$axios.post(`${this.url}`, this.healthUnit);

        this.$emit('addForm', { addForm: response.data });
        this.$bvToast.toast('Criado!', {
          title: 'Sucesso',
          autoHideDelay: 5000,
          variant: 'success',
          solid: true,
        });
        this.show = false;
        this.healthUnit = {
          id: null,
          unit_code: null,
          cnes_code: null,
          cnpj_maintainer_code: null,
          company_name: null,
          alias_company_name: null,
          company_type: null,
          ibge_state_id: 22,
          ibge_city_id: 221100,
          address: null,
          address_number: null,
          address_complement: null,
          neighborhood: null,
          cep_code: null,
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
        this.show = false;
      }
    },
    async updateForm() {
      try {
        const response = await this.$axios.put(`${this.url}`, this.healthUnit);

        this.$emit('addForm', { addForm: response.data });
        this.$bvToast.toast('Criado!', {
          title: 'Sucesso',
          autoHideDelay: 5000,
          variant: 'success',
          solid: true,
        });
        this.show = false;
        this.healthUnit = {
          id: null,
          unit_code: null,
          cnes_code: null,
          cnpj_maintainer_code: null,
          company_name: null,
          alias_company_name: null,
          company_type: null,
          ibge_state_id: 22,
          ibge_city_id: 221100,
          address: null,
          address_number: null,
          address_complement: null,
          neighborhood: null,
          cep_code: null,
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
        this.show = false;
      }
    },
  },
};
</script>

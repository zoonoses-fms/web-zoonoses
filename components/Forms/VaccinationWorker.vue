<template>
  <div class="input-group-append">
    <button
      :id="`button-md-${id}`"
      v-b-modal="`modal-md-${id}`"
      class="btn btn-outline-success"
      type="button"
      @click="showForm"
    >
      {{ textButton }} <slot name="button"> </slot>
    </button>

    <ValidationObserver v-slot="{ valid }">
      <b-modal
        :id="`modal-md-${id}`"
        size="md"
        scrollable
        :title="textButton"
        class="shadow-lg"
        @ok="handleOk"
      >
        <b-overlay :show="show" rounded="sm">
          <form ref="form" @submit.stop.prevent>
            <ValidationProvider
              v-slot="{ errors }"
              name="nome"
              :rules="{ required: true, min: 4 }"
            >
              <div class="form-group p-1">
                <div class="input-group">
                  <input
                    v-model="worker.name"
                    name="name-input"
                    class="form-control"
                    type="text"
                    placeholder="Nome:"
                  />
                </div>

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
              name="matrícula"
              :rules="{ required: true, min: 3 }"
            >
              <div class="form-group p-1">
                <div class="input-group">
                  <input
                    v-model="worker.registration"
                    name="name-input"
                    class="form-control"
                    type="text"
                    placeholder="Matrícula:"
                  />
                </div>

                <div
                  v-for="(error, index) in errors"
                  :key="index"
                  class="invalid-feedback d-block"
                >
                  {{ error }}
                </div>
              </div>
            </ValidationProvider>
            <div class="form-group p-1">
              <div class="input-group">
                <input
                  v-model="worker.phone"
                  v-mask="['(##) ####-####', '(##) #####-####']"
                  name="name-input"
                  class="form-control"
                  type="text"
                  placeholder="Telefone:"
                />
              </div>
            </div>
            <div class="form-group p-1">
              <div class="input-group">
                <input
                  v-model="worker.cpf"
                  v-mask="'###.###.###-##'"
                  name="name-input"
                  class="form-control"
                  type="text"
                  placeholder="CPF:"
                />
              </div>
            </div>
            <b-form-radio-group v-slot="{ ariaDescribedby }" v-model="worker.type"  label="Tipo">
              <b-form-radio
                :aria-describedby="ariaDescribedby"
                name="type-worker"
                value="fms"
                >FMS
              </b-form-radio>
              <b-form-radio
                :aria-describedby="ariaDescribedby"
                name="type-worker"
                value="ace"
                >ACE
              </b-form-radio>
              <b-form-radio
                :aria-describedby="ariaDescribedby"
                name="type-worker"
                value="acs"
                >ACS
              </b-form-radio>
            </b-form-radio-group>
          </form>
        </b-overlay>
        <template #modal-footer="{ ok, cancel }">
          <button
            class="btn btn-success"
            :disabled="!valid && worker.id == null"
            @click="ok()"
          >
            Salvar
          </button>
          <b-button variant="danger" @click="cancel()"> Sair </b-button>
        </template>
      </b-modal>
    </ValidationObserver>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import { mask } from 'vue-the-mask';
export default {
  name: 'FormVaccinationWorker',
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  directives: { mask },
  props: {
    nameModal: {
      type: String,
      default: null,
    },
    textButton: {
      type: String,
      required: true,
    },
    variant: {
      type: String,
      required: true,
    },
    oldWorker: {
      type: Object,
      default() {
        return {
          id: null,
          name: null,
          phone: null,
          cpf: null,
          registration: null,
          type: null,
        };
      },
    },
    url: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      id: null,
      show: false,
      worker: {
        type: Object,
        default() {
          return {
            id: null,
            name: null,
            phone: null,
            cpf: null,
            registration: null,
            type: null,
          };
        },
      },
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
    'worker.registration'(value) {
      // console.log(value);
    },
  },
  created() {
    if (this.nameModal != null) {
      this.id = this.nameModal;
    } else {
      this.id = this.oldWorker.id;
    }
  },
  methods: {
    showForm() {
      this.worker = { ...this.oldWorker };
    },
    handleOk() {
      this.show = true;
      if (this.worker.id) {
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
        const response = await this.$axios.post(`${this.url}`, this.worker);
        this.worker = response.data;
        this.$emit('create', this.worker);
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
          `${this.url}${this.worker.id}/`,
          this.worker
        );
        this.worker = response.data;
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
  },
};
</script>
<style scoped>
button {
  border-top-right-radius: 0.25rem !important;
  border-bottom-right-radius: 0.25rem !important;
}
</style>

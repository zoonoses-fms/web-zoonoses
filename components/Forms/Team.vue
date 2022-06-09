<template>
  <div>
    <b-button v-b-modal="`modal-md-${id}`" :variant="variant" @click="setTeam">
      {{ textButton }}
    </b-button>
    <ValidationObserver v-slot="{ invalid }">
      <b-modal
        :id="`modal-md-${id}`"
        size="md"
        scrollable
        :title="`${team.number}`"
        @ok="handleOk"
      >
        <b-overlay :show="show" rounded="sm">
          <div class="row p-2">
            <div class="col-12 px-2 py-2 shadow bg-white rounded">
              <form ref="form" @submit.stop.prevent>
                <div class="row">
                  <div class="col-12">
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="Núcleo"
                      :rules="{ required: true }"
                    >
                      <b-form-group label="Núcleo" label-for="core">
                        <b-form-select
                          v-model="team.core_id"
                          class="mb-3"
                          name="core"
                          @input="getUsers"
                        >
                          <b-form-select-option
                            v-for="core in cores"
                            :key="core.id"
                            :value="core.id"
                          >
                            {{ core.initial }}
                          </b-form-select-option>
                        </b-form-select>

                        <div
                          v-for="(error, index) in errors"
                          :key="index"
                          class="invalid-feedback d-block"
                        >
                          {{ error }}
                        </div>
                      </b-form-group>
                    </ValidationProvider>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="Supervisor"
                      :rules="{ required: true }"
                    >
                      <b-form-group label="Supervisor" label-for="user">
                        <b-form-select
                          v-model="team.user_id"
                          class="mb-3"
                          name="user"
                        >
                          <b-form-select-option
                            v-for="user in users"
                            :key="user.id"
                            :value="user.id"
                          >
                            {{ user.name }}
                          </b-form-select-option>
                        </b-form-select>

                        <div
                          v-for="(error, index) in errors"
                          :key="index"
                          class="invalid-feedback d-block"
                        >
                          {{ error }}
                        </div>
                      </b-form-group>
                    </ValidationProvider>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12">
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="Número"
                      :rules="{ required: true }"
                    >
                      <b-form-group label="Número" label-for="number-input">
                        <b-form-input
                          v-model="team.number"
                          name="number-input"
                          type="number"
                          label="Número"
                        >
                        </b-form-input>

                        <div
                          v-for="(error, index) in errors"
                          :key="index"
                          class="invalid-feedback d-block"
                        >
                          {{ error }}
                        </div>
                      </b-form-group>
                    </ValidationProvider>
                  </div>
                </div>

                <div class="row justify-content-center align-items-center">
                  <div class="col-12 align-self-center"></div>
                </div>
              </form>
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
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import is from '@/mixins/is';
export default {
  name: 'FormsTeam',
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  mixins: [is],
  props: {
    textButton: {
      type: String,
      required: true,
    },
    oldTeam: {
      type: Object,
      default() {
        return {
          id: null,
          number: null,
          core_id: null,
          user_id: null,
        };
      },
    },
    variant: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      initialImage: null,
      face: require('@/assets/img/face-0.jpg'),
      show: false,
      url: 'team/',
      id: null,
      cores: [],
      users: [],
      team: {
        id: null,
        number: null,
        core_id: null,
        user_id: null,
      },
    };
  },
  computed: {},
  created() {
    this.id = this.oldTeam.id;
    this.team = { ...this.oldTeam };
  },
  mounted() {},
  methods: {
    setTeam() {
      this.getCores();
      if (this.team.id) {
        this.getUsers();
      }
      // this.getUsers();
    },
    async createTeam() {
      try {
        const response = await this.$axios.post(`${this.url}`, this.team);
        this.team = response.data;
        this.$bvToast.toast('Cadastro efetuado!', {
          title: 'Sucesso',
          autoHideDelay: 5000,
          variant: 'success',
          solid: true,
        });
        this.$emit('createTeam', await response.data);
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
    async updateTeam() {
      try {
        const response = await this.$axios.put(
          `${this.url}${this.team.id}/`,
          this.team
        );
        this.team = response.data;

        this.$bvToast.toast('Cadastro atualizado!', {
          title: 'Sucesso',
          autoHideDelay: 5000,
          variant: 'success',
          solid: true,
        });
        this.$emit('updateTeam', await response.data);
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
      if (this.team.id) {
        this.updateTeam();
      } else {
        this.createTeam();
      }
      this.$nextTick(() => {
        // this.$bvModal.hide(`modal-xl-${this.id}`);
      });
      this.show = false;
    },
    async getUsers() {
      const response = await this.$axios.get('user', {
        params: {
          core: this.team.core_id,
        },
      });
      this.users = response.data;
    },
    async getCores() {
      const response = await this.$axios.get('core');
      this.cores = response.data;
    }
  },
};
</script>

<template>
  <div>
    <b-button v-b-modal="`modal-xl-${id}`" :variant="variant" @click="setUser">
      {{ textButton }}
    </b-button>
    <ValidationObserver v-slot="{ invalid }">
      <b-modal
        :id="`modal-xl-${id}`"
        size="xl"
        scrollable
        :title="user.username"
        @ok="handleOk"
      >
        <b-overlay :show="show" rounded="sm">
          <div class="row p-2">
            <div class="col-md-12 col-lg-6 px-2 py-2 shadow bg-white rounded">
              <form ref="form" @submit.stop.prevent>
                <div class="row">
                  <div class="col-12">
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="Nome"
                      :rules="{ required: true, min: 3 }"
                    >
                      <b-form-group label="Nome" label-for="first_name-input">
                        <b-form-input
                          v-model="user.name"
                          name="first_name-input"
                          type="text"
                          label="Nome"
                          placeholder="Nome"
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
                <div class="row">
                  <div class="col-12">
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="Email"
                      :rules="{ required: true, email: true }"
                    >
                      <b-form-group label="Email" label-for="email-input">
                        <b-form-input
                          v-model="user.email"
                          name="email-input"
                          type="email"
                          label="Email"
                          placeholder="Email"
                          @blur="checkEmail"
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
                <div class="row">
                  <div class="col-12">
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="Telefone"
                      :rules="{ required: true, min: 3 }"
                    >
                      <b-form-group label="Telefone" label-for="fone-input">
                        <b-form-input
                          v-model="user.phone"
                          name="fone-input"
                          type="text"
                          label="Telefone"
                          placeholder="Telefone"
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
                <div class="row">
                  <div class="col-12">
                    <b-form-group v-slot="{ ariaDescribedbyAbility }">
                      <b-form-checkbox-group
                        id="cores"
                        v-model="selectedCores"
                        :aria-describedby="ariaDescribedbyAbility"
                        name="flavour-2"
                        switches
                        @input="showAbilities"
                      >
                        <b-form-checkbox
                          v-for="core in cores"
                          :key="core.id"
                          :value="core.id"
                        >
                          <b>{{ core.initial }}</b>
                        </b-form-checkbox>
                      </b-form-checkbox-group>
                    </b-form-group>
                  </div>
                </div>

                <div v-if="user.id !== null" class="row">
                  <NuxtLink
                    class="m-2 btn btn-danger"
                    to="/auth/reset/password"
                    block
                  >
                    Recuparar Senha
                  </NuxtLink>
                </div>
                <div v-else class="row">
                  <div class="col-6">
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="Senha"
                      :rules="{
                        regex:
                          /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/,
                        required: true,
                      }"
                    >
                      <b-form-group label="Senha" label-for="password-input">
                        <b-form-input
                          v-model="user.password"
                          name="password-input"
                          type="password"
                          label="Senha"
                          placeholder="Ex: Senha@123"
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
                  <div class="col-6">
                    <ValidationProvider
                      v-slot="{ errors }"
                      name="Confirme a senha"
                      rules="required|password:@Senha"
                    >
                      <b-form-group
                        label="Confirme a senha"
                        label-for="password_confirmation-input"
                      >
                        <b-form-input
                          v-model="user.password_confirmation"
                          name="password_confirmation-input"
                          type="password"
                          label="Confirme a senha"
                          placeholder="Ex: Senha@123"
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
            <div class="col-md-12 col-lg-6 px-2 py-2 shadow bg-white rounded">
              <b-form-group v-slot="{ ariaDescribedby }" label="Plataformas:">
                <b-form-checkbox-group
                  id="plataforms"
                  v-model="selectedPlataformas"
                  :aria-describedby="ariaDescribedby"
                  name="flavour-2"
                  switches
                >
                  <b-form-checkbox
                    v-for="plataform in plataforms"
                    :key="plataform.id"
                    :value="plataform.id"
                  >
                    {{ plataform.description }}
                  </b-form-checkbox>
                </b-form-checkbox-group>
              </b-form-group>

              <div class="row">
                <div class="col-12">
                  <h5>Núcleos:</h5>
                  <div
                    v-for="core in showCores"
                    :key="core.id"
                    :value="core.id"
                  >
                    <b>{{ core.name }}</b>
                    <b-form-group v-slot="{ ariaDescribedbyAbility }">
                      <b-form-checkbox-group
                        id="abilities"
                        v-model="selectedAbilities"
                        :aria-describedby="ariaDescribedbyAbility"
                        name="flavour-2"
                        switches
                        stacked
                      >
                        <b-form-checkbox
                          v-for="ability in core.abilities"
                          :key="ability.id"
                          :value="ability.id"
                        >
                          <b>{{ ability.name }}</b>
                        </b-form-checkbox>
                      </b-form-checkbox-group>
                    </b-form-group>
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
import { ValidationObserver, ValidationProvider } from 'vee-validate';
import is from '@/mixins/is';
export default {
  name: 'FormsUser',
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
    oldUser: {
      type: Object,
      default() {
        return {
          id: null,
          username: null,
          name: null,
          password: null,
          email: null,
          is_staff: true,
          is_superuser: false,
          plataforms: [],
          cores: [],
          abilities: [],
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
      url: 'user/',
      id: null,
      plataforms: [],
      selectedPlataformas: [],
      cores: [],
      showCores: [],
      selectedCores: [],
      selectedAbilities: [],
      user: {
        id: null,
        username: null,
        name: null,
        password: null,
        email: null,
        is_staff: true,
        is_superuser: false,
        plataforms: [],
        cores: [],
        abilities: [],
      },
    };
  },
  computed: {},
  created() {
    this.id = this.oldUser.id;
    this.user = { ...this.oldUser };
  },
  mounted() {},
  methods: {
    setUser() {
      this.selectedPlataformas = [];
      this.selectedCores = [];
      this.selectedAbilities = [];
      this.user.cores.forEach((core) => {
        this.selectedCores.push(core.id);
      });
      this.getPlataforms();
      this.getCores();
    },
    async createUser() {
      try {
        const response = await this.$axios.post(`${this.url}`, this.user);
        this.user = response.data;
        this.$bvToast.toast('Cadastro efetuado!', {
          title: 'Sucesso',
          autoHideDelay: 5000,
          variant: 'success',
          solid: true,
        });
        this.$emit('createMember', await response.data);
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
    async updateUser() {
      try {
        const response = await this.$axios.put(
          `${this.url}${this.user.id}/`,
          this.user
        );
        this.user = response.data;

        this.$bvToast.toast('Cadastro atualizado!', {
          title: 'Sucesso',
          autoHideDelay: 5000,
          variant: 'success',
          solid: true,
        });
        this.$emit('updateMember', await response.data);
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
      if (
        this.selectedPlataformas.length > 0 &&
        this.selectedAbilities.length > 0 &&
        this.selectedCores.length > 0
      ) {
        this.user.plataforms = this.selectedPlataformas;
        this.user.cores = this.selectedCores;
        this.user.abilities = this.selectedAbilities;

        if (this.user.id) {
          this.updateUser();
        } else {
          this.createUser();
        }
        this.$nextTick(() => {
          // this.$bvModal.hide(`modal-xl-${this.id}`);
        });
      } else {
        this.$toast.error('Selecione, no minimo grupo');
        this.show = false;
      }
    },
    async getPlataforms() {
      const response = await this.$axios.get('plataform');
      this.plataforms = response.data;
      this.user.plataforms.forEach((plataform) => {
        this.selectedPlataformas.push(plataform.id);
      });
    },
    async getCores() {
      const response = await this.$axios.get('core');
      this.cores = response.data;
      this.showAbilities();
    },
    showAbilities() {
      this.showCores = [];
      this.cores.forEach((core) => {
        if (this.selectedCores.includes(core.id)) {
          this.showCores.push(core);
          core.abilities.forEach((ability) => {
            this.user.abilities.forEach((userAbility) => {
              if (ability.id === userAbility.id) {
                this.selectedAbilities.push(ability.id);
              }
            });
          });
        }
      });
    },
    async checkEmail() {
      const response = await this.$axios.get(
        `/users/check-email/${this.user.email}`
      );
      const status = await response.data;

      if (status) {
        this.$toast.error('Email já cadastrado');
      }
    },
    async updateImage() {
      const response = await this.$axios.get(`${this.url}${this.user.id}/`);
      this.member = response.data;
    },
  },
};
</script>

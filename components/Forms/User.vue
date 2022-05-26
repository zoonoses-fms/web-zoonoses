<template>
  <div>
    <b-button v-b-modal="`modal-lg-${id}`" :variant="variant" @click="setUser">
      {{ textButton }}
    </b-button>
    <ValidationObserver v-slot="{ invalid }">
      <b-modal
        :id="`modal-lg-${id}`"
        scrollable
        :title="user.username"
        @ok="handleOk"
      >
        <b-overlay :show="show" rounded="sm">
          <form ref="form" @submit.stop.prevent>
            <div class="row">
              <div class="col-12">
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
                    <b-form-group label="Ocupação" label-for="occupation-input">
                      <b-form-input
                        v-model="user.occupation"
                        name="occupation-input"
                        type="text"
                        label="Nome"
                        placeholder="Ocupação"
                      >
                      </b-form-input>
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
              </div>
            </div>
            <div v-if="isAdmin" class="row">
              <div class="col-12">
                <div class="accordion" role="tablist">
                  <b-card no-body class="mb-1">
                    <b-card-header header-tag="header" class="p-1" role="tab">
                      <b-button
                        v-b-toggle="`collapse-role-${id}`"
                        block
                        variant="info"
                      >
                        Grupos
                      </b-button>
                    </b-card-header>
                    <b-collapse
                      :id="`collapse-role-${id}`"
                      visible
                      accordion="roles"
                      role="tabpanel"
                    >
                      <b-card-body>
                        <b-card-text>
                          <div v-for="role in roles" :key="role.id" class="row">
                            {{ role.alias | truncate(30) }}
                            <b-form-checkbox
                              v-model="role.selected"
                              name="check-button"
                              switch
                              size="lg"
                              class="ml-2"
                            >
                            </b-form-checkbox>
                          </div>
                        </b-card-text>
                      </b-card-body>
                    </b-collapse>
                  </b-card>
                </div>
              </div>
            </div>
          </form>
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
          roles: [],
          user_permissions: [],
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
      roles: [],
      user: {
        id: null,
        username: null,
        name: null,
        password: null,
        email: null,
        is_staff: true,
        is_superuser: false,
        roles: [],
        user_permissions: [],
      },
      selectedRoles: [],
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
      this.getRoles();
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
      this.selectedRoles = [];
      this.roles.forEach((group) => {
        if (group.selected) {
          this.selectedRoles.push(group.id);
        }
      });

      if (this.selectedRoles.length > 0) {
        this.user.roles = this.selectedRoles;

        if (this.user.id) {
          this.updateMember();
        } else {
          this.createMember();
        }
        this.$nextTick(() => {
          // this.$bvModal.hide(`modal-xl-${this.id}`);
        });
      } else {
        this.$toast.error('Selecione, no minimo grupo');
        this.show = false;
      }
    },
    async getRoles() {
      const response = await this.$axios.get('role/?limit=100');
      this.roles = await response.data;
      console.log(this.roles);
      this.roles.forEach((role) => {
        role.selected = false;
      });
      this.user.roles.forEach((memberGroup) => {
        this.roles.forEach((group) => {
          if (group.id === memberGroup.id) {
            group.selected = true;
          }
        });
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

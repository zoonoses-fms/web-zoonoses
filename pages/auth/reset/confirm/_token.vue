<template>
  <div>
    <div class="container">
      <div class="row justify-content-center align-items-center">
        <div class="col-xl-4 col-lg-5 col-md-6">
          <BCard class="text-center">
            <b-overlay :show="show" rounded="sm">
              <ValidationObserver v-slot="{ invalid }">
                <b-form ref="form" @submit.stop.prevent>
                  <b-form-group
                    id="input-group-token"
                    label="Token:"
                    label-for="input-token"
                  >
                    <b-form-input v-model="token" disabled></b-form-input>
                  </b-form-group>
                  <b-form-group
                    id="input-group-email"
                    label="E-mail:"
                    label-for="input-email"
                  >
                    <b-form-input v-model="email" disabled></b-form-input>
                  </b-form-group>

                  <div class="row">
                    <div class="col-6">
                      <validation-provider
                        v-slot="validationContext"
                        name="Senha"
                        :rules="{
                          regex:
                            /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$/,
                          required: true,
                        }"
                      >
                        <b-form-group
                          id="password-input-text"
                          label="Senha"
                          label-for="password-input"
                        >
                          <b-form-input
                            id="password-input"
                            v-model="password"
                            name="password-input"
                            type="password"
                            label="Senha"
                            :state="getValidationState(validationContext)"
                            placeholder="Ex: Senha@123"
                            aria-describedby="password-live-feedback"
                          >
                          </b-form-input>
                          <b-form-invalid-feedback id="password-live-feedback">
                            {{ validationContext.errors[0] }}, a senha deve ter
                            no mínimo 8 caracteres 1 minúscula 1 maiúscula 1
                            número e 1 caracter especial
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </validation-provider>
                    </div>
                    <div class="col-6">
                      <validation-provider
                        id="password_confirmation-input-text"
                        v-slot="validationContext"
                        name="Confirme a senha"
                        rules="required|password:@Senha"
                      >
                        <b-form-group
                          label="Confirme a senha"
                          label-for="password_confirmation-input"
                        >
                          <b-form-input
                            id="password_confirmation-input"
                            v-model="password_confirmation"
                            name="password_confirmation-input"
                            type="password"
                            label="Confirme a senha"
                            :state="getValidationState(validationContext)"
                            placeholder="Ex: Senha@123"
                            aria-describedby="password_confirmation-live-feedback"
                          >
                          </b-form-input>
                          <b-form-invalid-feedback
                            id="password_confirmation-live-feedback"
                          >
                            {{ validationContext.errors[0] }}
                          </b-form-invalid-feedback>
                        </b-form-group>
                      </validation-provider>
                    </div>
                  </div>

                  <button
                    class="btn btn-success btn-sm"
                    :disabled="invalid"
                    @click="handleSubmit"
                  >
                    Alterar senha
                  </button>
                </b-form>
              </ValidationObserver>
            </b-overlay>
          </BCard>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      token: null,
      email: null,
      password: null,
      password_confirmation: null,
      show: false,
      url: 'reset-password/',
    };
  },
  created() {
    this.token = this.$route.params.token;
    this.email = this.$route.params.email;
    this.welcomeMessage();
  },
  methods: {
    getValidationState({ dirty, validated, valid = null }) {
      return dirty || validated ? valid : null;
    },
    welcomeMessage() {
      this.$store.commit('layout/CHANGE_NAV_TITLE', 'Recuperar Senha...');
    },
    async activeUser() {
      try {
        await this.$axios.post(
          `${this.url}`,
          {
            token: this.token,
            email: this.email,
            password: this.password,
            password_confirmation: this.password_confirmation,
          },
          {
            timeout: 30000,
          }
        );

        this.$bvToast.toast('Senha alterada!', {
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
    handleSubmit() {
      this.show = true;

      this.activeUser();
      this.$nextTick(() => {});
    },
  },
};
</script>

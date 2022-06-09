<template>
  <main class="form-signin card">
    <img :src="logo" class="card-img-top" alt="logo" />
    <div class="card-body">
      <ValidationObserver v-slot="{ invalid }">
        <b-form v-if="show" @submit.stop.prevent="onSubmit" @reset="onReset">
          <h1 class="h3 mb-3 fw-normal">Login</h1>

          <ValidationProvider
            v-slot="{ errors }"
            name="E-mail"
            rules="required|email"
            immediate
          >
            <b-form-group
              id="input-group-email"
              label="Email:"
              label-for="input-email"
            >
              <b-form-input
                id="input-email"
                v-model="user.email"
                type="email"
                placeholder="E-mail"
                required
              ></b-form-input>

              <div
                v-for="(error, index) in errors"
                :key="index"
                class="invalid-feedback d-block"
              >
                {{ error }}
              </div>
            </b-form-group>
          </ValidationProvider>

          <ValidationProvider
            v-slot="{ errors }"
            name="Senha"
            rules="required"
            immediate
          >
            <b-form-group
              id="input-group-password"
              label="Senha:"
              label-for="input-password"
            >
              <b-form-input
                id="input-password"
                v-model="user.password"
                type="password"
                placeholder="Senha"
                required
              ></b-form-input>

              <div
                v-for="(error, index) in errors"
                :key="index"
                class="invalid-feedback d-block"
              >
                {{ error }}
              </div>
            </b-form-group>
          </ValidationProvider>
          <button
            class="w-100 btn btn-lg btn-primary"
            type="submit"
            :disabled="invalid"
          >
            Login
          </button>
        </b-form>
      </ValidationObserver>
    </div>
  </main>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate';
export default {
  name: 'LoginPage',
  auth: 'guest',
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  data() {
    return {
      show: true,
      user: {
        email: '',
        password: '',
      },
      logo: require('@/assets/img/background.png'),
      platformUuid: process.env.PLATFORM_UUID,
      platformPassword: process.env.PLATFORM_PASSWORD,
    };
  },
  created() {},
  mounted() {},
  methods: {
    async onSubmit() {
      try {
        const response = await this.$auth.loginWith('local', {
          data: {
            plataforma_uuid: this.platformUuid,
            plataforma_password: this.platformPassword,
            email: this.user.email,
            password: this.user.password,
          },
        });
        this.$bvToast.toast('Login efetuado!', {
          title: 'Sucesso',
          autoHideDelay: 5000,
          variant: 'success',
          solid: true,
        });
        this.$auth.strategy.token.set(response.data.access_token);
        this.$auth.setUser(response.data.user);
        // Refresh tokens
        this.$auth.refreshTokens();
        this.$router.push('/');
      } catch (errors) {
        // const erros = error.response.data.data;
        console.log(errors.response.data.data);
        for (const prop in errors.response.data.data) {
          errors.response.data.data[prop].forEach((element) => {
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
    onReset() {
      console.log('onReset');
    },
  },
};
</script>

<style>
.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin-top: 15px;
  margin-left: auto;
  margin-right: auto;
}
</style>

<template>
  <div>
    <div class="container">
      <div class="row justify-content-center align-items-center">
        <div class="col-xl-4 col-lg-5 col-md-6">
          <BCard class="text-center">
            <b-overlay :show="show" rounded="sm">
              <b-form ref="form" @submit.stop.prevent="handleSubmit">
                <b-form-group
                  id="input-group-email"
                  label="E-mail:"
                  label-for="input-email"
                >
                  <b-form-input
                    v-model="email"
                    type="email"
                    required
                    placeholder="exemplo@exemplo.com"
                  ></b-form-input>
                </b-form-group>
                <b-button type="submit" variant="primary"
                  >Recuperar Senha</b-button
                >
              </b-form>
            </b-overlay>
          </BCard>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ResetPasswordPage',
  components: {},
  data() {
    return {
      email: null,
      show: false,
      url: 'forgot-password',
    };
  },
  created() {
    this.welcomeMessage();
  },
  methods: {
    welcomeMessage() {
      this.$store.commit('layout/CHANGE_NAV_TITLE', 'Recuperar senha');
    },
    async activeUser() {
      try {
        await this.$axios.post(
          `${this.url}`,
          {
            email: this.email,
          },
          {
            timeout: 30000,
          }
        );

        this.$bvToast.toast('Email enviado!', {
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
      this.activeUser();
      this.$nextTick(() => {});
    },
  },
};
</script>

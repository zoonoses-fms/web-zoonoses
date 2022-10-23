<template>
  <main class="form-signin card">
    <img :src="logo" class="card-img-top" alt="logo" />
    <div class="card-body">
      <ValidationObserver v-slot="{ invalid }">
        <b-form v-if="show" @submit.stop.prevent="onSubmit" @reset="onReset">
          <h1 class="h3 mb-3 fw-normal">Registro de Vacina</h1>
          <b-form-select v-model="selectedCampaign" class="mb-3">
            <b-form-select-option
              v-for="campaign in campaigns"
              :key="campaign.id"
              :value="campaign.id"
            >
              {{ campaign.year }}
            </b-form-select-option>
          </b-form-select>
          <div v-show="cycles.length > 0">
            <b-form-select v-model="selectedCycles" class="mb-3">
              <b-form-select-option
                v-for="cycle in cycles"
                :key="cycle.id"
                :value="cycle.id"
              >
                {{ cycle.description }}
              </b-form-select-option>
            </b-form-select>
          </div>

          <ValidationProvider
            v-slot="{ errors }"
            name="Matrícula"
            rules="required"
            immediate
          >
            <b-form-group
              id="input-group-registration"
              label="Matrícula:"
              label-for="input-registration"
            >
              <b-form-input
                id="input-registration"
                v-model="worker.registration"
                type="text"
                placeholder="Matrícula"
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
  name: 'IndexPage',
  auth: 'guest',
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  layout: 'simple',
  data() {
    return {
      show: true,
      worker: {
        registration: '',
      },
      url: 'ncrlo/vaccination/worker/login',
      logo: require('@/assets/img/background.png'),
      platformUuid: process.env.PLATFORM_UUID,
      platformPassword: process.env.PLATFORM_PASSWORD,
      campaigns: [],
      selectedCampaign: null,
      cycles: [],
      selectedCycles: null,
    };
  },
  watch: {
    selectedCampaign(value) {

      if(value !== null) {
        console.log(value);
        this.getCampaignAndCycles();
      }
    }
  },
  created() {
    this.getCampaigns();
  },
  mounted() {},
  methods: {
    async onSubmit() {
      try {
        const response = await this.$axios.post(this.url, {
          plataforma_uuid: this.platformUuid,
          plataforma_password: this.platformPassword,
          cycles: this.selectedCycles,
          registration: this.worker.registration,
        });
        this.$bvToast.toast('Login efetuado!', {
          title: 'Sucesso',
          autoHideDelay: 5000,
          variant: 'success',
          solid: true,
        });

        this.$store.commit('cva/SET_WORKER', response.data);
        this.$router.push(`cva/${this.selectedCycles}/${this.worker.registration}`);
        // router.push(`/user/${username}`);
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
    async getCampaigns() {
      try {
        const response = await this.$axios.get(`ncrlo/campaign/`, {
          params: {},
        });
        this.campaigns = await response.data.data;
      } catch (error) {
        /* if(error.response.status === 401) {
          this.$router.push('/');
        } */
      }
    },
    async getCampaignAndCycles() {
      try {
        const response = await this.$axios.get(
          `ncrlo/campaign/${this.selectedCampaign}`,
          {
            params: {},
          }
        );
        this.cycles = await response.data.cycles;
      } catch (error) {
        /* if(error.response.status === 401) {
          this.$router.push('/');
        } */
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

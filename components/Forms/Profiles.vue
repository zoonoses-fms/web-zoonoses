<template>
  <div>
    <ValidationObserver v-slot="{ valid }">
      <form @submit.prevent>
        <b-modal
          :id="`modal-profile-${oldProfile.id}`"
          title="Cricar Perfil"
          @ok="handleOk"
        >
          <BOverlay :show="show" rounded="sm">
            <ValidationProvider
              v-slot="{ errors }"
              name="Nome"
              :rules="{ required: true, min: 4 }"
            >
              <div class="form-group">
                <label>
                  Nome
                  <input
                    v-model="profile.name"
                    type="text"
                    class="form-control"
                    placeholder="Nome"
                  />
                </label>
              </div>
              <div
                v-for="(error, index) in errors"
                :key="index"
                class="invalid-feedback d-block"
              >
                {{ error }}
              </div>
            </ValidationProvider>

            <div class="form-group">
              <label>
                Escope de trabalho
                <select v-model="profile.scope" class="form-control">
                  <option disabled :value="null">Selecione um</option>
                  <option
                    v-for="(item, index) in scopeOptions"
                    :key="index"
                    :value="item.value"
                  >
                    {{ item.text }}
                  </option>
                </select>
              </label>
            </div>
            <div class="form-group">
              <label>
                Local de trabalho
                <select v-model="profile.management" class="form-control">
                  <option disabled :value="null">Selecione um</option>
                  <option
                    v-for="(item, index) in managementOptions"
                    :key="index"
                    :value="item.value"
                  >
                    {{ item.text }}
                  </option>
                </select>
              </label>
            </div>

            <b-form-checkbox v-model="profile.is_single_allocation" switch>
              Pode ser alocado em um só local?
            </b-form-checkbox>
            <b-form-checkbox v-model="profile.is_pre_campaign" switch>
              Trabalha na pre campanha?
            </b-form-checkbox>
            <b-form-checkbox v-model="profile.is_multiple" switch>
              Perfil de multiplos trabalhadores?
            </b-form-checkbox>
            <b-form-checkbox v-model="profile.is_rural" switch>
              Perfil rural?
            </b-form-checkbox>
            <b-form-checkbox v-model="profile.is_pre_load" switch>
              Perfil sem custos?
            </b-form-checkbox>
          </BOverlay>
          <template #modal-footer="{ ok, cancel }">
            <button
              type="submit"
              class="btn btn-success"
              :disabled="!valid && profile.id === null"
              @click="ok()"
            >
              Salvar
            </button>
            <b-button variant="danger" @click="cancel()"> Sair </b-button>
          </template>
        </b-modal>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate';

export default {
  name: 'FormsProfiles',
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  props: {
    oldProfile: {
      type: Object,
      default() {
        return {
          id: null,
          name: null,
          scope: null,
          management: null,
          is_single_allocation: true,
          is_pre_campaign: false,
          is_multiple: false,
          is_rural: false,
        };
      },
    },
  },
  data() {
    return {
      profile: {
        id: null,
        name: null,
        scope: null,
        management: null,
        is_single_allocation: true,
        is_pre_campaign: false,
        is_multiple: false,
        is_rural: false,
      },
      scopeOptions: [
        { value: 'campaign', text: 'Campanha' },
        { value: 'cycle', text: 'Etapa' },
        { value: 'support', text: 'Ponto de Apoio' },
        { value: 'point', text: 'Posto de Vacinação' },
      ],
      managementOptions: [
        { value: 'GEZOON', text: 'GEZOON' },
        { value: 'GETRANS', text: 'GETRANS' },
        { value: 'Rede de Frio', text: 'Rede de Frio' },
      ],
      show: false,
      url: 'ncrlo/vaccination/profile/workers/',
    };
  },
  created() {
    if (this.oldProfile.id != null) {
      this.profile = { ...this.oldProfile };
    }
  },
  methods: {
    async create() {
      try {
        const response = await this.$axios.post(`${this.url}`, this.profile);
        this.$bvToast.toast('Cadastro efetuado!', {
          title: 'Sucesso',
          autoHideDelay: 5000,
          variant: 'success',
          solid: true,
        });
        this.$emit('create', await response.data);
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
          `${this.url}${this.profile.id}/`,
          this.profile
        );
        this.$bvToast.toast('Cadastro atualizado!', {
          title: 'Sucesso',
          autoHideDelay: 5000,
          variant: 'success',
          solid: true,
        });
        this.$emit('update', await response.data);
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
      if (this.profile.id) {
        this.update();
      } else {
        this.create();
      }
      this.$nextTick(() => {
        // this.$bvModal.hide(`modal-xl-${this.id}`);
      });
      this.show = false;
    },
  },
};
</script>

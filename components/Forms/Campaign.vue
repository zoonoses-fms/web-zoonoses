<template>
  <div>
    <b-button
      v-b-modal="`modal-xl-${id}`"
      :variant="variant"
      @click="setCampaign"
    >
      {{ textButton }}
      <b-icon-pencil></b-icon-pencil>
    </b-button>
    <ValidationObserver v-slot="{ valid }">
      <form @submit.prevent="handleOk">
        <b-modal
          :id="`modal-xl-${id}`"
          size="xl"
          scrollable
          :title="campaign.year ? `${campaign.year}` : ``"
          @ok="handleOk"
        >
          <BOverlay :show="show" rounded="sm">
            <div class="container-fluid">
              <div class="row pb-1">
                <div class="col-12 d-flex justify-content-end">
                  <NuxtLink
                    to="/ncrlo/vaccination/worker"
                    class="btn btn-success"
                  >
                    Lista da equipe
                  </NuxtLink>
                </div>
              </div>
              <div class="row pb-1">
                <div class="col-4 px-1">
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="Ano"
                    :rules="{ required: true, min: 4, max: 4 }"
                  >
                    <div class="form-group">
                      <label for="year-input">Ano</label>
                      <select
                        v-model="campaign.year"
                        name="year-input"
                        class="form-control form-control-sm"
                      >
                        <option
                          v-for="(year, index) in years"
                          :key="index"
                          :value="year"
                        >
                          {{ year }}
                        </option>
                      </select>
                      <div
                        v-for="(error, index) in errors"
                        :key="index"
                        class="invalid-feedback d-block"
                      >
                        {{ error }}
                      </div>
                    </div>
                  </ValidationProvider>
                </div>
                <div class="col-4 px-1">
                  <ValidationProvider
                    v-slot="{ errors }"
                    name="Início"
                    :rules="{ required: true }"
                  >
                    <div class="form-group">
                      <label for="start-input">Início</label>
                      <input
                        v-model="campaign.start"
                        name="start-input"
                        class="form-control form-control-sm"
                        type="date"
                      />
                      <div
                        v-for="(error, index) in errors"
                        :key="index"
                        class="invalid-feedback d-block"
                      >
                        {{ error }}
                      </div>
                    </div>
                  </ValidationProvider>
                </div>
                <div class="col-4 px-1">
                  <div class="form-group">
                    <label for="end-input">Fim</label>
                    <input
                      v-model="campaign.end"
                      name="end-input"
                      class="form-control form-control-sm"
                      type="date"
                    />
                  </div>
                </div>
              </div>
              <FormsSelectProfiles
                v-model="campaign.profiles"
                :date="campaign.start"
              />
              <div v-if="campaign.id !== null" class="row">
                <div class="col-12">
                  <TablesCampaignProfileWorkers
                    :profiles.sync="campaign.profiles_all"
                    :campaign-id="campaign.id"
                    @changeCost="setCost"
                    @addProfile="addProfile"
                    @removeProfile="removeProfile"
                  />
                </div>
              </div>
            </div>
          </BOverlay>

          <template #modal-footer="{ ok, cancel }">
            <button
              type="submit"
              class="btn btn-success"
              :disabled="!valid && campaign.id === null"
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
  name: 'FormsVaccinationCampaign',
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  props: {
    textButton: {
      type: String,
      required: true,
    },
    oldCampaign: {
      type: Object,
      default() {
        return {
          id: null,
          year: null,
          start: null,
          end: null,
          profiles_all: [],
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
      id: null,
      show: false,
      url: 'ncrlo/campaign/',
      campaign: {
        id: null,
        year: null,
        start: null,
        end: null,
        goal: 0,
        profiles_all: [],
      },
      listWorkers: [],
    };
  },
  computed: {
    years() {
      const today = new Date();
      const start = today.getFullYear() + 1;
      const end = 2010;
      const years = [];

      for (let i = start; i >= end; i--) {
        years.push(i);
      }
      return years;
    },
  },
  created() {
    this.id = this.oldCampaign.id;
  },
  methods: {
    setCampaign() {
      this.campaign = { ...this.oldCampaign };
      if (this.campaign.id) {
        // get data
      }
    },
    async create() {
      try {
        await this.$axios.post(`${this.url}`, this.campaign);
        this.$emit('input', { status: 'create' });
      } catch (errors) {
        this.$emit('input', { status: 'errors', errors });
        this.show = false;
      }
    },
    async update() {
      try {
        await this.$axios.put(`${this.url}${this.campaign.id}`, this.campaign);
        this.$emit('input', { status: 'update' });
      } catch (errors) {
        this.$emit('input', { status: 'errors', errors });
        this.show = false;
      }
    },
    handleOk() {
      this.show = true;
      this.handleSubmit();
    },
    handleSubmit() {
      if (this.campaign.id) {
        this.update();
      } else {
        this.create();
      }
      this.$nextTick(() => {
        // this.$bvModal.hide(`modal-xl-${this.id}`);
      });
      this.show = false;
    },
    setCoordinator(id) {
      this.campaign.coordinator_id = id;
    },
    setCost(item) {
      const index = this.campaign.profiles_all.findIndex((profile) => {
        return profile.id === item.id;
      });
      this.campaign.profiles_all[index].pivot.cost = item.pivot.cost;
      this.campaign.update_cost = true;
    },
    addProfile(item) {
      item.pivot = {
        cost: 0,
      };
      this.campaign.profiles_all.push(item);
    },
    removeProfile(item) {
      const index = this.campaign.profiles_all.findIndex((profile) => {
        return profile.id === item.id;
      });
      if (index >= 0) {
        this.campaign.profiles_all.splice(index, 1);
      }

      const indexProfiler = this.campaign.profiles.findIndex((profile) => {
        return profile.id === item.id;
      });

      if (indexProfiler >= 0) {
        this.campaign.profiles.splice(index, 1);
      }
    }
  },
};
</script>

<template>
  <div class="row">
    <div
      v-for="profile in profiles"
      :key="profile.id"
      class="form-group p-1 w-100 col-12"
    >
      <div class="card">
        <div class="card-header">
          {{ profile.name }} - {{ profile.management }}
        </div>
        <div class="card-body p-0">
          <div
            v-if="profile.is_pre_campaign == 0"
            class="input-group"
          >
            <label class="form-control h-auto">
              <Multiselect
                v-model="profile.workers[0]"
                :options="
                  profile.is_pre_load ? [...preListWorker] : [...listWorkers]
                "
                :searchable="true"
                :close-on-select="!profile.is_multiple"
                :show-labels="true"
                deselect-label="Clique para remover"
                select-label="Clique para selecionar"
                selected-label="Selecionado"
                :multiple="profile.is_multiple"
                track-by="id"
                label="label"
                placeholder="Selecione"
                :allow-empty="true"
                @select="select"
              >
                <template slot="singleLabel" slot-scope="{ option }">
                  <strong>{{ option.id }}</strong> : 
                  <strong>{{ option.name }}</strong> Matrícula
                  <strong>{{ option.registration }}</strong>
                </template>
                <template slot="noResult">
                  <span>Oops! Sem resultados</span>
                </template>
                <template slot="noOptions">
                  <span>Oops! Sem opção</span>
                </template>
              </Multiselect>
            </label>
            <div class="input-group-append">
              <FormsVaccinationWorker
                :name-modal="`worker-${profile.id}`"
                text-button=""
                variant="success"
                :url="url"
                @create="setWorker($event, profile.workers[0])"
              >
                <template #button>
                  <BIconPencil />
                </template>
              </FormsVaccinationWorker>
            </div>
          </div>

          <template v-else>
            <BTabs card>
              <BTab
                v-for="day in getListDays(profile.is_pre_campaign)"
                :key="day.index"
                :title="day.date"
                active
                class="p-0"
              >
                <div class="input-group">
                  <label class="form-control h-auto">
                    <Multiselect
                      v-model="profile.workers[day.index]"
                      :options="
                        profile.is_pre_load
                          ? [...preListWorker]
                          : [...listWorkers]
                      "
                      :searchable="true"
                      :close-on-select="!profile.is_multiple"
                      :show-labels="true"
                      deselect-label="Clique para remover"
                      select-label="Clique para selecionar"
                      selected-label="Selecionado"
                      :multiple="profile.is_multiple"
                      track-by="id"
                      label="label"
                      placeholder="Selecione"
                      :allow-empty="true"
                      @select="select"
                    >
                      <template slot="singleLabel" slot-scope="{ option }">
                        <strong>{{ option.id }}</strong> : 
                        <strong>{{ option.name }}</strong> Matrícula
                        <strong>{{ option.registration }}</strong>
                      </template>
                      <template slot="noResult">
                        <span>Oops! Sem resultados</span>
                      </template>
                      <template slot="noOptions">
                        <span>Oops! Sem opção</span>
                      </template>
                    </Multiselect>
                  </label>
                  <div class="input-group-append">
                    <FormsVaccinationWorker
                      :name-modal="`worker-${profile.id}-${day.index}`"
                      text-button=""
                      variant="success"
                      :url="url"
                      @create="setWorker($event, profile.workers[day.index])"
                    >
                      <template #button>
                        <BIconPencil />
                      </template>
                    </FormsVaccinationWorker>
                  </div>
                </div>
              </BTab>
            </BTabs>
          </template>

          <!--           <div
            v-for="day in getListDays(profile.is_pre_campaign)"
            :key="day.index"
          >
            {{ day.index }} - {{ day.date }} oi
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
export default {
  name: 'FormsSelectProfiles',
  components: {
    Multiselect,
  },
  props: {
    value: {
      type: [Array, Object],
      default: () => [],
    },
    date: {
      type: String,
      default: null,
    },
    preListWorker: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      profiles: { ...this.value },
      listWorkers: [],
      url: 'ncrlo/vaccination/worker/',
      dates: [],
    };
  },
  computed: {},
  created() {
    this.getWorker();

    if (this.date != null) {
      this.dates.push(new Date(`${this.date}T00:00:00`));
      this.dates.push(new Date(`${this.date}T00:00:00`));

      this.dates[0].setDate(this.dates[1].getDate() - 1);
    }
  },
  methods: {
    async getWorker() {
      const params = {
        list_type: 'all',
      };

      try {
        const response = await this.$axios.get(this.url, { params });

        this.listWorkers = response.data;
      } catch (error) {
        console.log(error);
      }
    },
    select() {
      this.$emit('input', this.profiles);
    },
    setWorker(worker, workers) {
      if (Array.isArray(workers)) {
        workers.push(worker);
      } else {
        workers = worker;
      }
    },
    getListDays(numberOfDays) {
      const days = [];
      // const arrayDays = [...Array(numberOfDays+1).keys()];

      for (let index = 0; index <= numberOfDays; index++) {
        let date = null;

        if (this.date != null) {
          date = new Date(`${this.date}T00:00:00`);
          date.setDate(date.getDate() - index);
          date = date.toLocaleDateString('pt-BR');
        }

        days.push({
          index,
          date,
        });
      }

      return days;
    },
  },
};
</script>
<style scoped>
.card {
  font-size: 0.75rem;
}
</style>

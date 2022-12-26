<template>
  <div class="row">
    <div
      v-for="profile in profiles"
      :key="profile.id"
      class="form-group p-1 w-100 col-12"
    >
      <div
        v-if="!profile.is_pre_campaign"
        class="input-group mb-3 border border-success rounded"
      >
        <label class="form-control h-auto">
          {{ profile.name }} - {{ profile.management }}
          <Multiselect
            v-model="profile.workers"
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
            label="name"
            placeholder="Selecione"
            :allow-empty="true"
            @select="select"
          >
            <template slot="singleLabel" slot-scope="{ option }">
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
            @create="setWorker($event, profile.workers)"
          >
            <template #button>
              <BIconPencil />
            </template>
          </FormsVaccinationWorker>
        </div>
      </div>

      <template v-else>
        <BCard no-body>
          <BCardHeader>
            {{ profile.name }} - {{ profile.management }}
          </BCardHeader>
          <BTabs card>
            <BTab
              v-for="(worker, index) in profile.workers"
              :key="index"
              :title="dates[index] | formatDate"
              active
            >
              <div class="input-group mb-3 border border-success rounded">
                <label class="form-control h-auto">
                  <Multiselect
                    v-model="profile.workers[index]"
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
                    label="name"
                    placeholder="Selecione"
                    :allow-empty="true"
                    @select="select"
                  >
                    <template slot="singleLabel" slot-scope="{ option }">
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
                    :name-modal="`worker-${profile.id}-${index}`"
                    text-button=""
                    variant="success"
                    :url="url"
                    @create="setWorker($event, profile.workers[index])"
                  >
                    <template #button>
                      <BIconPencil />
                    </template>
                  </FormsVaccinationWorker>
                </div>
              </div>
            </BTab>
          </BTabs>
        </BCard>
      </template>
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
  },
};
</script>

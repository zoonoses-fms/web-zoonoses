<template>
  <div>
    <BListGroup v-for="profile in profilesCycle" :key="profile.id">
      <BListGroupItem
        v-if="profile.workers.length > 0"
        class="flex-column align-items-start"
      >
        <div class="d-flex w-100 justify-content-between">
          <h6 v-b-toggle="`collapse-${cycle.id}-${profile.id}`" class="mb-1">
            {{ profile.name }}
          </h6>
        </div>

        <BCollapse :id="`collapse-${cycle.id}-${profile.id}`">
          <BTable
            striped
            hover
            :items.sync="profile.workers"
            :fields="fields"
            small
            class="table"
          >
            <template #cell(name)="data">
              {{ data.item.name }}
            </template>
            <template #cell(type)="data">
              {{ data.item.workerId }}: {{ data.item.type }}
              <BFormRadioGroup
                v-slot="{ ariaDescribedby }"
                v-model="data.item.type"
                label="Tipo"
                @change="changeTypeWorker(data.item.workerId, data.item.type)"
              >
                <BFormRadio
                  :aria-describedby="ariaDescribedby"
                  name="type-worker"
                  value="fms"
                  >FMS
                </BFormRadio>
                <BFormRadio
                  :aria-describedby="ariaDescribedby"
                  name="type-worker"
                  value="ace"
                  >ACE
                </BFormRadio>
                <BFormRadio
                  :aria-describedby="ariaDescribedby"
                  name="type-worker"
                  value="acs"
                  >ACS
                </BFormRadio>
              </BFormRadioGroup>
            </template>
            <template #cell(is_confirmation)="data">
              <BFormCheckbox
                :id="`checkbox-${data.item.id}`"
                v-model="data.item.is_confirmation"
                name="checkbox-is_confirmation"
                @change="changeConfirmation(data.item)"
              />
            </template>
          </BTable>
        </BCollapse>
      </BListGroupItem>
    </BListGroup>
    <BListGroup>
      <BListGroupItem class="flex-column align-items-start">
        <BButton v-b-toggle="`collapse-support-${cycle.id}`" class="mb-1" block>
          Equipes de Ponto de Apoio
        </BButton>
        <BCollapse
          :id="`collapse-support-${cycle.id}`"
          @show="getWorkersSupport()"
        >
          <div v-if="loadingSupport" class="d-flex justify-content-center mb-3">
            <b-spinner label="Loading..."></b-spinner>
          </div>
          <BContainer fluid>
            <div class="d-flex w-100 justify-content-end">
              <BFormGroup
                label="Busca:"
                label-for="filter-input"
                label-cols-sm="12"
                label-align-sm="right"
                label-size="sm"
                class="mb-1"
              >
                <BInputGroup size="sm">
                  <BFormInput
                    id="filter-input"
                    v-model="filterSupport"
                    type="search"
                    placeholder="Digite aqui!"
                  ></BFormInput>

                  <BInputGroup-append>
                    <BButton
                      :disabled="!filterSupport"
                      @click="filterSupport = ''"
                      >Clear</BButton
                    >
                  </BInputGroup-append>
                </BInputGroup>
              </BFormGroup>
            </div>

            <BTable
              v-if="!loadingSupport"
              striped
              hover
              :items="workersSupport"
              :fields="fieldsSupport"
              small
              class="table"
              :filter="filterSupport"
              :filter-included-fields="['name']"
              :sort-by.sync="sortBySupport"
              :sort-desc.sync="sortDescSupport"
            >
              <template #cell(name)="data">
                {{ data.item.name }}
              </template>
              <template #cell(type)="data">
                {{ data.item.workerId }}: {{ data.item.type }}
                <BFormRadioGroup
                  v-slot="{ ariaDescribedby }"
                  v-model="data.item.type"
                  label="Tipo"
                  @change="changeTypeWorker(data.item.workerId, data.item.type)"
                >
                  <BFormRadio
                    :aria-describedby="ariaDescribedby"
                    name="type-worker"
                    value="fms"
                    >FMS
                  </BFormRadio>
                  <BFormRadio
                    :aria-describedby="ariaDescribedby"
                    name="type-worker"
                    value="ace"
                    >ACE
                  </BFormRadio>
                  <BFormRadio
                    :aria-describedby="ariaDescribedby"
                    name="type-worker"
                    value="acs"
                    >ACS
                  </BFormRadio>
                </BFormRadioGroup>
              </template>
              <template #cell(is_confirmation)="data">
                <BFormCheckbox
                  :id="`checkbox-${data.item.id}`"
                  v-model="data.item.is_confirmation"
                  name="checkbox-is_confirmation"
                  @change="changeConfirmation(data.item)"
                />
              </template>
            </BTable>
          </BContainer>
        </BCollapse>
      </BListGroupItem>
    </BListGroup>
    <BListGroup>
      <BListGroupItem class="flex-column align-items-start">
        <BButton
          v-b-toggle="`collapse-support-point-${cycle.id}`"
          class="mb-1"
          block
        >
          Equipes dos Postos
        </BButton>
        <BCollapse
          :id="`collapse-support-point-${cycle.id}`"
          @show="getWorkersPoint()"
        >
          <div v-if="loadingPoint" class="d-flex justify-content-center mb-3">
            <b-spinner label="Loading..."></b-spinner>
          </div>
          <BContainer fluid>
            <div class="d-flex w-100 justify-content-end">
              <BFormGroup
                label="Busca:"
                label-for="filter-input"
                label-cols-sm="12"
                label-align-sm="right"
                label-size="sm"
                class="mb-1"
              >
                <BInputGroup size="sm">
                  <BFormInput
                    id="filter-input"
                    v-model="filterPoint"
                    type="search"
                    placeholder="Digite aqui!"
                  ></BFormInput>

                  <BInputGroup-append>
                    <BButton :disabled="!filterPoint" @click="filterPoint = ''"
                      >Clear</BButton
                    >
                  </BInputGroup-append>
                </BInputGroup>
                <BFormCheckboxGroup v-model="filterOnPoint" class="mt-1">
                  <BFormCheckbox value="name">Nome</BFormCheckbox>
                  <BFormCheckbox value="suppot">AP</BFormCheckbox>
                  <BFormCheckbox value="point">Posto</BFormCheckbox>
                </BFormCheckboxGroup>
              </BFormGroup>
            </div>

            <BTable
              v-if="!loadingPoint"
              striped
              hover
              :items="workersPoint"
              :fields="fieldsPoint"
              small
              class="table"
              :filter="filterPoint"
              :filter-included-fields="filterOnPoint"
              :sort-by.sync="sortByPoint"
              :sort-desc.sync="sortDescPoint"
            >
              <template #cell(name)="data">
                {{ data.item.name }}
              </template>
              <template #cell(type)="data">
                {{ data.item.workerId }}: {{ data.item.type }}
                <BFormRadioGroup
                  v-slot="{ ariaDescribedby }"
                  v-model="data.item.type"
                  label="Tipo"
                  @change="changeTypeWorker(data.item.workerId, data.item.type)"
                >
                  <BFormRadio
                    :aria-describedby="ariaDescribedby"
                    name="type-worker"
                    value="fms"
                    >FMS
                  </BFormRadio>
                  <BFormRadio
                    :aria-describedby="ariaDescribedby"
                    name="type-worker"
                    value="ace"
                    >ACE
                  </BFormRadio>
                  <BFormRadio
                    :aria-describedby="ariaDescribedby"
                    name="type-worker"
                    value="acs"
                    >ACS
                  </BFormRadio>
                </BFormRadioGroup>
              </template>
              <template #cell(is_confirmation)="data">
                <BFormCheckbox
                  :id="`checkbox-${data.item.id}`"
                  v-model="data.item.is_confirmation"
                  name="checkbox-is_confirmation"
                  @change="changeConfirmation(data.item)"
                />
              </template>
            </BTable>
          </BContainer>
        </BCollapse>
      </BListGroupItem>
    </BListGroup>
  </div>
</template>

<script>
export default {
  name: 'TablesProfilesWorkers',
  props: {
    cycle: {
      type: Object,
      default: () => {
        return {
          profiles: [],
        };
      },
    },
  },
  data: () => {
    return {
      fields: [
        {
          key: 'date',
          label: 'Data',
          sortable: true,
        },
        {
          key: 'name',
          label: 'Nome',
          sortable: true,
        },
        {
          key: 'type',
          label: 'Tipo',
          sortable: true,
        },
        {
          key: 'is_confirmation',
          label: 'Confirmado',
          sortable: true,
        },
      ],
      fieldsSupport: [
        {
          key: 'name',
          label: 'Nome',
          sortable: true,
        },
        {
          key: 'support',
          label: 'PA',
          sortable: true,
        },
        {
          key: 'profile',
          label: 'Perfil',
          sortable: true,
        },
        {
          key: 'type',
          label: 'Tipo',
          sortable: true,
        },
        {
          key: 'saads',
          label: 'SAAD',
          sortable: true,
        },
        {
          key: 'is_confirmation',
          label: 'Confirmado',
          sortable: true,
        },
      ],
      fieldsPoint: [
        {
          key: 'area',
          label: 'Área',
          sortable: true,
        },
        {
          key: 'order',
          label: 'Ordem',
          sortable: true,
        },
        {
          key: 'name',
          label: 'Nome',
          sortable: true,
        },
        {
          key: 'support',
          label: 'PA',
          sortable: true,
        },
        {
          key: 'point',
          label: 'Posto',
          sortable: true,
        },
        {
          key: 'profile',
          label: 'Perfil',
          sortable: true,
        },
        {
          key: 'type',
          label: 'Tipo',
          sortable: true,
        },
        {
          key: 'saads',
          label: 'SAAD',
          sortable: true,
        },
        {
          key: 'is_confirmation',
          label: 'Confirmado',
          sortable: true,
        },
      ],
      sortBySupport: 'support',
      sortDescSupport: false,
      sortByPoint: 'order',
      sortDescPoint: false,
      filterOnPoint: ['name'],
      loadingSupport: true,
      workersSupport: [],
      filterSupport: null,
      loadingPoint: true,
      workersPoint: [],
      filterPoint: null,
      sortDirection: 'asc',
      profilesCycle: [],
      url: 'ncrlo/campaign/worker/',
      urlWorker: 'ncrlo/vaccination/worker/',
    };
  },
  watch: {
    // whenever question changes, this function will run
    cycle: function () {
      this.handleProfileCycle();
    },
  },
  created: function () {},
  mounted: function () {
    this.$nextTick(function () {
      this.handleProfileCycle();
    });
  },
  methods: {
    changeTypeWorker: async function (workerId, type) {
      const q = new URLSearchParams({
        change_type: type,
      });
      try {
        const response = await this.$axios.put(
          `${this.urlWorker}${workerId}/?${q.toString()}`,
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
    getWorkersPoint: async function () {
      const q = new URLSearchParams({
        campaign_id: this.cycle.campaign_id,
        campaign_cycle_id: this.cycle.id,
        scope: 'point',
      });

      const response = await this.$axios.get(`${this.url}?${q.toString()}`);

      const campaignWorkers = response.data;

      const workers = [];

      campaignWorkers.forEach((worker) => {
        const saads = [];
        worker.support.saads.forEach((saad) => {
          saads.push(saad.name);
        });

        workers.push({
          id: worker.id,
          area: parseFloat(worker.point.area),
          order: parseFloat(worker.point.order),
          name: worker.worker.name,
          support: worker.support.support.name,
          point: worker.point.point.name,
          profile: worker.profile.name,
          workerId: worker.worker.id,
          type: worker.worker.type,
          saads: saads.join(),
          is_confirmation: worker.is_confirmation,
          _rowVariant: worker.is_confirmation ? 'success' : 'danger',
        });
      });

      this.workersPoint = workers;

      this.loadingPoint = false;
    },
    getWorkersSupport: async function () {
      const q = new URLSearchParams({
        campaign_id: this.cycle.campaign_id,
        campaign_cycle_id: this.cycle.id,
        scope: 'support',
      });

      const response = await this.$axios.get(`${this.url}?${q.toString()}`);

      const campaignWorkers = response.data;

      const workers = [];

      campaignWorkers.forEach((worker) => {
        const saads = [];
        worker.support.saads.forEach((saad) => {
          saads.push(saad.name);
        });

        workers.push({
          id: worker.id,
          name: worker.worker.name,
          support: worker.support.support.name,
          profile: worker.profile.name,
          workerId: worker.worker.id,
          type: worker.worker.type,
          saads: saads.join(),
          is_confirmation: worker.is_confirmation,
          _rowVariant: worker.is_confirmation ? 'success' : 'danger',
        });
      });

      this.workersSupport = workers;

      this.loadingSupport = false;
    },
    changeConfirmation: async function (item) {
      try {
        const response = await this.$axios.put(
          `${this.url}${item.id}/?is_confirmation=${item.is_confirmation}`,
          item
        );
        this.$bvToast.toast('Cadastro atualizado!', {
          title: 'Sucesso',
          autoHideDelay: 5000,
          variant: 'success',
          solid: true,
        });
        this.$emit('update', await response.data);
        this.show = false;
        item._rowVariant = item.is_confirmation ? 'success' : 'danger';
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
    getDate: function (worker) {
      const date = new Date(`${this.cycle.start}T00:00:00`);
      if (worker.pivot.is_pre_campaign === 0) {
        return date.toLocaleDateString('pt-BR');
      }
      date.setDate(date.getDate() - worker.pivot.is_pre_campaign);
      return date.toLocaleDateString('pt-BR');
    },
    createRow: function (profile, worker) {
      console.log(worker.type);
      const date = this.getDate(worker);
      profile.workers.push({
        id: worker.pivot.id,
        date,
        workerId: worker.id,
        name: worker.name,
        type: worker.type,
        is_confirmation: worker.pivot.is_confirmation,
        _rowVariant: worker.pivot.is_confirmation ? 'success' : 'danger',
      });
    },
    handleProfileCycle: function () {
      this.cycle.profiles.forEach((profile) => {
        const newProfile = {
          id: profile.id,
          name: `${profile.name} - ${profile.management}`,
        };
        newProfile.workers = [];

        if (Array.isArray(profile.workers)) {
          profile.workers.forEach((worker) => {
            if (Array.isArray(worker)) {
              worker.forEach((w) => {
                this.createRow(newProfile, w);
              });
            } else {
              this.createRow(newProfile, worker);
            }
          });
        } else {
          this.createRow(newProfile, profile.workers);
        }
        this.profilesCycle = [...this.profilesCycle, newProfile];
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>

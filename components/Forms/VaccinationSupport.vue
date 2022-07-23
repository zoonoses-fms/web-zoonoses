<template>
  <div>
    <b-button v-b-modal="`modal-xl-${id}`" :variant="variant" @click="showForm">
      {{ textButton }}
    </b-button>
    <ValidationObserver v-slot="{ invalid }">
      <b-modal
        :id="`modal-xl-${id}`"
        size="xl"
        scrollable
        :title="textButton"
        class="shadow-lg"
        @ok="handleOk"
      >
        <b-overlay :show="show" rounded="sm">
          <form ref="form" @submit.stop.prevent>
            <div class="row">
              <div class="col-12 col-md-6 col-lg-4 px-1">
                <ValidationProvider
                  v-slot="{ errors }"
                  name="nome"
                  :rules="{ required: true, min: 4 }"
                >
                  <div class="form-group border border-success rounded p-1">
                    <div class="input-group">
                      <input
                        v-model="vaccinationSupport.name"
                        name="name-input"
                        class="form-control"
                        type="text"
                        placeholder="Nome:"
                        @keyup.enter="getGeocodingByName"
                      />
                      <div class="input-group-append">
                        <button
                          class="btn btn-outline-success"
                          type="button"
                          @click="getGeocodingByName"
                        >
                          <b-icon icon="search"></b-icon>
                        </button>
                      </div>
                    </div>

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
              <div
                v-if="vaccinationSupport.geometry != null"
                class="col-6 col-md-4 col-lg-2 mb-2"
              >
                <div class="border border-success rounded p-1">
                  <div class="custom-control custom-switch py-2">
                    <input
                      id="action-edit"
                      v-model="editable"
                      type="checkbox"
                      value="edit"
                      class="custom-control-input"
                    />
                    <label class="custom-control-label" for="action-edit"
                      >Editar</label
                    >
                  </div>
                </div>
              </div>

              <div
                v-if="vaccinationSupport.geometry == null"
                class="col-6 col-md-4 col-lg-2 mb-2"
              >
                <div class="border border-danger rounded p-1">
                  <div class="custom-control custom-switch py-2">
                    <input
                      id="action-add"
                      v-model="add"
                      type="checkbox"
                      value="add"
                      class="custom-control-input"
                    />
                    <label class="custom-control-label" for="action-add">
                      Criar
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-9 col-md-5 col-lg-4 px-1">
                <ValidationProvider
                  v-slot="{ errors }"
                  name="Endereço"
                  :rules="{ required: true, min: 4 }"
                >
                  <div class="form-group border border-warning rounded p-1">
                    <div class="input-group">
                      <input
                        v-model="vaccinationSupport.address"
                        name="address-input"
                        class="form-control"
                        type="text"
                        placeholder="Endereço:"
                      />
                    </div>

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
              <div class="col-3 col-md-2 col-lg-1 px-1">
                <div class="form-group border border-warning rounded p-1">
                  <div class="input-group">
                    <input
                      v-model="vaccinationSupport.number"
                      name="number-input"
                      class="form-control"
                      type="number"
                      placeholder="N"
                    />
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-5 col-lg-3 px-1">
                <div class="form-group border border-warning rounded p-1">
                  <div class="input-group">
                    <input
                      v-model="vaccinationSupport.address_complement"
                      name="address-complement-input"
                      class="form-control"
                      type="text"
                      placeholder="Complemento:"
                    />
                  </div>
                </div>
              </div>
              <div class="col-6 col-md-6 col-lg-3 px-1">
                <div class="form-group border border-warning rounded p-1">
                  <div class="input-group">
                    <input
                      v-model="vaccinationSupport.neighborhood"
                      name="neighborhood-input"
                      class="form-control"
                      type="text"
                      placeholder="Bairro:"
                    />
                  </div>
                </div>
              </div>
              <div class="col-6 col-md-6 col-lg-1 px-1">
                <div class="form-group border border-warning rounded p-1">
                  <button
                    class="btn btn-outline-warning btn-block"
                    type="button"
                    @click="getGeocodingByAddress"
                  >
                    <b-icon icon="search"></b-icon>
                  </button>
                </div>
              </div>
            </div>
          </form>
          <div class="row">
            <div
              v-if="geocodes.length > 0"
              class="table col-12 col-md-6 col-lg-4"
            >
              <b-table
                id="table-supports"
                striped
                responsive
                hover
                small
                selectable
                :fields="fields"
                :items="geocodes"
                select-mode="single"
                primary-key="place_id"
                @row-selected="onRowSelected"
              >
                <template #cell(selected)="{ rowSelected }">
                  <template v-if="rowSelected">
                    <span aria-hidden="true">&check;</span>
                    <span class="sr-only">Selected</span>
                  </template>
                  <template v-else>
                    <span aria-hidden="true">&nbsp;</span>
                    <span class="sr-only">Not selected</span>
                  </template>
                </template>
                <template #cell(place)="data">
                  {{ data.item.properties.display_name | truncate(128) }}
                </template>
              </b-table>
            </div>
            <div
              class="map-points col-12"
              :class="{ 'col-md-6 col-lg-8': geocodes.length > 0 }"
            >
              <OlMapPoints
                height="50"
                :map-features.sync="selectedFeature"
                :zoom-out="10"
                :editable.sync="editable"
                :add.sync="add"
                @modify="updateGeometry"
                @add="addGeometry"
              >
              </OlMapPoints>
            </div>
          </div>
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
import geocode from '@/mixins/geocode';
export default {
  name: 'FormVaccinationSupport',
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  mixins: [geocode],
  props: {
    textButton: {
      type: String,
      required: true,
    },
    variant: {
      type: String,
      required: true,
    },
    oldVaccinationSupport: {
      type: Object,
      default() {
        return {
          id: null,
          name: null,
          address: null,
          number: null,
          address_complement: null,
          neighborhood: null,
          the_neighborhood_alias_id: null,
          geometry: null,
        };
      },
    },
  },
  data() {
    return {
      id: null,
      show: false,
      url: 'ncrlo/vaccination/support/',
      providerGeocoder: 'nominatim',
      vaccinationSupport: {
        type: Object,
        default() {
          return {
            id: null,
            name: null,
            address: null,
            number: null,
            address_complement: null,
            neighborhood: null,
            neighborhood_alias_id: null,
            geometry: null,
          };
        },
      },
      geocodes: [],
      selectedFeature: [],
      fields: [
        {
          key: 'selected',
          label: '',
          sortable: true,
        },
        {
          key: 'place',
          label: 'Local',
          sortable: true,
        },
      ],
      editable: false,
      add: false,
    };
  },
  watch: {},
  created() {
    this.id = this.oldVaccinationSupport.id;
  },
  methods: {
    showForm() {
      this.vaccinationSupport = { ...this.oldVaccinationSupport };
      if (this.oldVaccinationSupport.geometry != null) {
        this.selectedFeature = [
          this.generateGeoJson(this.oldVaccinationSupport),
        ];
      }
    },
    handleOk() {
      this.show = true;
      if (this.vaccinationSupport.id) {
        this.update();
      } else {
        this.create();
      }
      this.$nextTick(() => {
        // this.$bvModal.hide(`modal-xl-${this.id}`);
      });
      this.show = false;
    },
    async create() {
      try {
        const response = await this.$axios.post(
          `${this.url}`,
          this.vaccinationSupport
        );
        this.vaccinationSupport = response.data;
        this.$emit('updateSupport');
        this.$bvToast.toast('Cadastro efetuado!', {
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

        this.show = false;
      }
    },
    async update() {
      try {
        const response = await this.$axios.put(
          `${this.url}${this.vaccinationSupport.id}/`,
          this.vaccinationSupport
        );
        this.vaccinationSupport = response.data;
        this.$emit('updateSupport');
        this.$bvToast.toast('Cadastro atualizado!', {
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
    async getGeocodingByName() {
      this.show = true;
      this.geocodes = await this.getGeocoding(
        this.vaccinationSupport.name,
        this.providerGeocoder
      );
      this.show = false;
    },
    async getGeocodingByAddress() {
      let queryString = '';
      queryString += this.vaccinationSupport.number
        ? `${this.vaccinationSupport.number} `
        : '';

      queryString += this.vaccinationSupport.address
        ? `${this.vaccinationSupport.address} `
        : '';

      queryString += this.vaccinationSupport.neighborhood
        ? `${this.vaccinationSupport.neighborhood} `
        : '';

      this.show = true;
      this.geocodes = await this.getGeocoding(
        queryString,
        this.providerGeocoder
      );

      this.show = false;
    },
    onRowSelected(items) {
      if (items.length > 0) {
        this.selectedFeature = [...items];
        this.vaccinationSupport.address = items[0].properties.address;
        this.vaccinationSupport.number = items[0].properties.number;
        this.vaccinationSupport.neighborhood = items[0].properties.neighborhood;
        this.vaccinationSupport.geometry = items[0].geometry;
      }
    },
    updateGeometry(featureCollection) {
      const collection = JSON.parse(featureCollection);
      // console.log(collection.features[0].geometry);
      this.vaccinationSupport.geometry = collection.features[0].geometry;
    },
    addGeometry(featureCollection) {
      const collection = JSON.parse(featureCollection);
      // console.log(collection.features[0].geometry);
      this.vaccinationSupport.geometry = collection.features[0].geometry;
      this.add = false;
      this.editable = true;
    },
  },
};
</script>
<style scoped>
.table {
  height: 50vh;
  overflow-y: scroll;
}

.map-points {
  width: 100%;
  height: 50vh;
}
</style>

<template>
  <main class="container-fluid">
    <div class="row m-2 justify-content-between">
      <div class="col-sm-12 col-md-6 d-flex justify-content-star">
        <NuxtLink to="/ncrlo/vaccination/support" class="btn btn-success">
          Todos os Pontos de Apoio
        </NuxtLink>
        <ModalSearchWorker :cycle-id="cycle.id"> </ModalSearchWorker>
      </div>
      <div class="col-sm-12 col-md-6 d-flex justify-content-end">
        <FormsAddSupport
          text-button="Adicionar Apoio"
          variant="primary"
          :current-cycle.sync="cycle"
          @addSupport="addSupport"
        ></FormsAddSupport>
      </div>
    </div>
    <div v-if="newSupports.length > 0">
      <div class="row justify-content-between">
        <div class="col-12">
          <BCard class="text-center">
            <template #header>
              <div class="row m-0">
                <div class="col-sm-12 col-md-6 d-flex justify-content-start">
                  <h5 class="mb-0">Novos Pontos de Apoio</h5>
                </div>
                <div class="col-sm-12 col-md-6 d-flex justify-content-end">
                  <b-button variant="success" @click="saveSupport"> Salvar </b-button>
                </div>
              </div>
            </template>
            <BTable
              id="table-cycle-supports"
              striped
              responsive
              hover
              :fields="fieldsListAdd"
              :items="newSupports"
              primary-key="id"
            >
              <template #cell(name)="data">
                {{ data.item.name }}
              </template>
              <template #cell(address)="data">
                {{ data.item.address }}
              </template>
              <template #cell(number)="data">
                {{ data.item.number }}
              </template>
            </BTable>
          </BCard>
        </div>
      </div>
    </div>
    <div class="row justify-content-between">
      <div class="col-12">
        <BCard>
          <BTable
            id="table-cycle-new-supports"
            striped
            responsive
            hover
            small
            :fields="fields"
            :items="supports"
            primary-key="id"
          >
            <template #cell(pendency)="data">
              <div class="d-flex justify-content-center">
                <b-icon-exclamation-circle
                  v-if="data.item.pendency"
                  variant="danger"
                  font-scale="2"
                ></b-icon-exclamation-circle>
                <b-icon-check-circle
                  v-else
                  variant="success"
                  font-scale="2"
                ></b-icon-check-circle>
              </div>
            </template>
            <template #cell(name)="data">
              <div v-if="data.item.support !== null">
                {{ data.item.support.name }}
              </div>
            </template>
            <template #cell(address)="data">
              <div v-if="data.item.support !== null">
                {{ data.item.support.address }}
              </div>
            </template>
            <template #cell(number)="data">
              <div v-if="data.item.support !== null">
                {{ data.item.support.number }}
              </div>
            </template>
            <template #cell(neighborhood)="data">
              <div
                v-if="
                  data.item.support !== null &&
                  data.item.support.neighborhood_alias !== null
                "
              >
                {{ data.item.support.neighborhood_alias.name }}
              </div>
            </template>
            <template #cell(saad)="data">
              <span v-for="saad in data.item.saads" :key="saad.id">
                {{ saad.name }}
              </span>
            </template>
            <template #cell(frequency)="data">
              <ModalFrequencySupport
                :item="data.item"
                :url="`${urlCampaignSupport}frequency/`"
              />
            </template>
            <template #cell(edit)="data">
              <LazyFormsCampaignSupport
                text-button=""
                variant="success"
                :cycle="cycle"
                :old-support="data.item"
                :title="data.item.support ? data.item.support.name : ''"
                @input="feedback"
              ></LazyFormsCampaignSupport>
            </template>
            <template #cell(details)="data">
              <NuxtLink
                :to="`/ncrlo/campaign/support/${data.item.id}`"
                class="btn btn-warning"
              >
                <BIconSearch></BIconSearch>
              </NuxtLink>
            </template>
            <template #cell(delete)="data">
              <LazyModalDelete
                :item="data.item"
                :url="urlCampaignSupport"
                text-button=""
                @deletItem="getDetailCycle"
              >
              </LazyModalDelete>
            </template>
          </BTable>
        </BCard>
      </div>
    </div>
  </main>
</template>

<script>
import toast from "@/mixins/toast";
export default {
  name: "CycleDetailsPage",
  mixins: [toast],
  data() {
    return {
      cycle: {
        start: null,
      },
      supports: [],
      newSupports: [],
      url: "ncrlo/campaign/cycle/",
      urlCampaignSupport: "ncrlo/campaign/support/",
      fieldsListAdd: [
        {
          key: "name",
          label: "Name",
          sortable: true,
        },
        {
          key: "address",
          label: "Endereço",
          sortable: true,
        },
        {
          key: "number",
          label: "Número",
        },
      ],
      fields: [
        {
          key: "pendency",
          label: "Pendência",
          sortable: true,
        },
        {
          key: "order",
          label: "Ordem",
          sortable: true,
        },
        {
          key: "name",
          label: "Name",
          sortable: true,
        },
        {
          key: "address",
          label: "Endereço",
          sortable: true,
        },
        {
          key: "number",
          label: "Número",
        },
        {
          key: "neighborhood",
          label: "Bairro",
        },
        {
          key: "saad",
          label: "SAAD",
        },
        {
          key: "frequency",
          label: "Freq.",
        },
        {
          key: "edit",
          label: "Editar",
        },
        {
          key: "details",
          label: "Detalhes",
        },
        {
          key: "delete",
          label: "Excluir",
        },
      ],
    };
  },

  created() {
    this.getDetailCycle();
    this.welcomeMessage();
  },
  methods: {
    welcomeMessage() {
      this.$store.commit(
        "layout/CHANGE_NAV_TITLE",
        "Pontos de apoio a campanha de vacinação"
      );
    },
    feedback(params) {
      this.toast(params);
      this.getDetailCycle();
    },
    async getDetailCycle() {
      this.supports = [];

      const response = await this.$axios.get(`${this.url}${this.$route.params.id}`);
      this.cycle = response.data;

      this.cycle.supports.forEach((support) => {
        support.pendency = false;
        this.supports.push(support);
      });
    },
    addSupport(support) {
      this.newSupports.push({ ...support, _rowVariant: "success" });
    },
    saveSupport() {
      let counter = 0;
      const i = setInterval(async () => {
        const element = this.newSupports[counter];

        try {
          await this.$axios.post(`${this.urlCampaignSupport}`, {
            ...element,
            campaign_cycle_id: this.$route.params.id,
          });
          this.toast({ status: "success" });
        } catch (errors) {
          this.toast({ status: "errors", errors });
        }

        counter++;
        if (counter === this.newSupports.length) {
          this.newSupports = [];
          this.getDetailCycle();
          clearInterval(i);
        }
      }, 1000);
    },
    async frequencyPdf(support) {
      try {
        const response = await this.$axios.get(
          `${this.urlCampaignSupport}frequency/${support.id}`,
          {
            responseType: "blob",
          }
        );
        const today = new Date().toISOString().slice(0, 10);
        const blob = new Blob([response.data], { type: "application/pdf" });
        // const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.target = "_blank";
        link.download = `${today}-Frequência de Locação de Pessoal.pdf`;
        link.click();
      } catch (error) {
        const message =
          (error.response && error.response.data) || error.message || error.toString();
        console.log(message);
      }
    },
  },
};
</script>

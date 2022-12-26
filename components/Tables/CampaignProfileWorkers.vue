<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <div class="input-group mb-3">
          <b-form-select v-model="profileSelected">
            <b-form-select-option
              v-for="profile in profileOptions"
              :key="profile.id"
              :value="profile"
              >{{ profile.name }} -
              {{ profile.management }}</b-form-select-option
            >
          </b-form-select>
          <div class="input-group-append">
            <button
              id="button-add-profile"
              class="btn btn-outline-success"
              type="button"
              :disabled="!profileSelected"
              @click="addProfile"
            >
              Adicionar
            </button>
            <button
              id="button-create-profile"
              v-b-modal="`modal-profile-${null}`"
              class="btn btn-outline-success"
              type="button"
            >
              Criar Perfil
            </button>

            <FormsProfiles @create="getProfileWorkers" />
          </div>
        </div>
      </div>
    </div>
    <BTable
      striped
      hover
      :items="profiles"
      :fields="fields"
      small
      class="table"
    >
      <template #cell(name)="data">
        {{ data.item.name }} - {{ data.item.management }}
      </template>
      <template #cell(cost)="data">
        <template v-if="!data.item.is_pre_load">
          <money
            v-model="data.item.pivot.cost"
            v-bind="money"
            name="coordinator-cost-input"
            class="form-control form-control-sm"
            type="text"
            @blur.native="changeCost(data.item)"
          />
        </template>
        <template v-else>
          <strong>Perfil sem custo</strong>
        </template>
      </template>
      <template #cell(scope)="data">
        {{ data.item.scope === 'campaign' ? 'Geral' : '' }}
        {{ data.item.scope === 'cycle' ? 'Coordenação da Etapa' : '' }}
        {{
          data.item.scope === 'support' && data.item.is_rural === true
            ? 'Área'
            : ''
        }}
        {{
          data.item.scope === 'support' && data.item.is_rural === false
            ? 'Ponto de Apoio'
            : ''
        }}
        {{ data.item.scope === 'point' ? 'Posto' : '' }}
      </template>
      <template #cell(is_rural)="data">
        {{ data.item.is_rural === true ? 'Rural' : 'Urbana' }}
      </template>
      <template #cell(edit)="data">
        <button
          id="button-create-profile"
          v-b-modal="`modal-profile-${data.item.id}`"
          class="btn btn-outline-success btn-sm"
          type="button"
        >
          <BIconPencil font-scale="1" />
        </button>

        <FormsProfiles :old-profile="data.item" />
      </template>
      <template #cell(remove)="data">
        <button
          class="btn btn-outline-danger btn-sm"
          type="button"
          @click="$emit('removeProfile', data.item)"
        >
          <BIconTrash font-scale="1" />
        </button>

      </template>
    </BTable>
  </div>
</template>

<script>
import { Money } from 'v-money';
export default {
  name: 'TableCampaignProfileWorkers',
  components: {
    Money,
  },
  props: {
    profiles: {
      type: Array,
      required: true,
    },
    campaignId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      campaignProfile: [],
      profileSelected: null,
      fields: [
        {
          key: 'id',
          label: 'Id',
          sortable: true,
        },
        {
          key: 'name',
          label: 'Nome',
          sortable: true,
        },
        {
          key: 'cost',
          label: 'R$',
        },
        {
          key: 'scope',
          label: 'Escopo',
          sortable: true,
        },
        {
          key: 'is_rural',
          label: 'Zona',
        },
        {
          key: 'edit',
          label: 'Editar',
        },
        {
          key: 'remove',
          label: 'Remover',
        },
      ],
      money: {
        decimal: ',',
        thousands: '.',
        prefix: 'R$ ',
        suffix: '',
        precision: 2,
        masked: false /* doesn't work with directive */,
      },
      profileOptions: [],
    };
  },
  created() {
    this.getProfileWorkers(this.campaignId);
  },
  methods: {
    changeCost(item) {
      this.$emit('changeCost', item);
    },
    async getProfileWorkers() {
      const response = await this.$axios.get(
        `ncrlo/vaccination/profile/workers?campaign_id=${this.campaignId}`
      );
      this.profileOptions = response.data;
    },
    addProfile() {
      this.$emit('addProfile', this.profileSelected);
    },
  },
};
</script>
<style scoped>
.table {
  font-size: 12px;
}
</style>

<template>
  <main class="container-fluid">
    <div class="row justify-content-around">
      <div class="col-12">
        <BCard>
          <BTable
            id="table-collarings"
            striped
            responsive
            hover
            small
            :fields="fields"
            :items="rows"
            primary-key="id"
          >
            <template #cell(id)="data">
              {{ data.item.id }}
            </template>
            <template #cell(date)="data">
              {{ data.item.date }}
            </template>
            <template #cell(saad)="data">
              {{ data.item.saad.name }}
            </template>
            <template #cell(neighborhood)="data">
              {{ data.item.neighborhood.name }}
            </template>
            <template #cell(address)="data">
              {{ data.item.address }}, {{ data.item.address_number }}
            </template>
            <template #cell(owner_name)="data">
              {{ data.item.address }}, {{ data.item.owner_name }}
            </template>

            <template #cell(edit)="data">
              <LazyFormsCampaign
                text-button=""
                variant="success"
                :old-campaign="data.item"
                @input="feedback"
              ></LazyFormsCampaign>
            </template>
            <template #cell(delete)="data">
              <LazyModalDelete
                :item="data.item"
                :url="url"
                text-button=""
                @deletItem="getRows"
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
export default {
  name: 'CollaringPage',
  data() {
    return {
      url: 'ncrlo/campaign/',
      fields: [
        {
          key: 'id',
          label: 'Id',
          sortable: true,
        },
        {
          key: 'date',
          label: 'Data',
          sortable: true,
        },
        {
          key: 'saad',
          label: 'SAAD',
          sortable: true,
        },
        {
          key: 'neighborhood',
          label: 'Bairro',
          sortable: true,
        },
        {
          key: 'address',
          label: 'Endereço',
          sortable: true,
        },
        {
          key: 'owner_name',
          label: 'Dono(a)',
          sortable: true,
        },
        {
          key: 'edit',
          label: 'Editar',
        },
        {
          key: 'delete',
          label: 'Excluir',
        },
      ],
      perPage: 10,
      currentPage: 1,
      totalRows: 0,
      search: '',
      rows: [],
    };
  },
};
</script>

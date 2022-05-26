import * as XLSX from 'xlsx';

export default {
  data() {
    return {};
  },
  methods: {
    async exportData() {
      this.perPage = 100000;
      const response = await this.$axios.get(this.url, {
        params: this.params,
      });

      const items = [];

      response.data.data.forEach((healthUnit) => {
        delete healthUnit.latitude;
        delete healthUnit.longitude;
        delete healthUnit.stock_form_alive;
        delete healthUnit.stock_form_death;
        items.push(healthUnit);
      });
      const today = new Date().toISOString().slice(0, 10);
      const data = XLSX.utils.json_to_sheet(items);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, data, 'data');
      XLSX.writeFile(wb, `${today}-dn.xlsx`);
      this.perPage = 10;
    },
    async exportDataByHealthUnit(healthUnit) {
      this.perPage = 100000;
      const response = await this.$axios.get(
        `${this.url}health_unit/${healthUnit.cnes_code}`,
        {
          params: this.params,
        }
      );

      const forms = response.data;
      let date;

      for (let i = 0; i < forms.length; i++) {
        date = new Date(forms[i].updated_at);
        forms[i].updated_at = date.toLocaleDateString('pt-BR');
      }

      const today = new Date().toISOString().slice(0, 10);
      const data = XLSX.utils.json_to_sheet(forms);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, data, 'data');
      XLSX.writeFile(
        wb,
        `${today}-${healthUnit.cnes_code}-${healthUnit.name}-${this.module}.xlsx`
      );
      this.perPage = 10;
    },
  },
};

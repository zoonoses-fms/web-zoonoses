export default {
  methods: {
    toast(params) {
      if (params.status === 'create') {
        this.$bvToast.toast('Cadastro Realizado!', {
          title: 'Sucesso',
          autoHideDelay: 5000,
          variant: 'success',
          solid: true,
        });
      } else if (params.status === 'update') {
        this.$bvToast.toast('Cadastro atualizado!', {
          title: 'Sucesso',
          autoHideDelay: 5000,
          variant: 'success',
          solid: true,
        });
      } else if (params.status === 'errors') {
        console.log(params.errors);
        for (const prop in params.errors.response.data) {
          params.errors.response.data[prop].forEach((element) => {
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
  },
};

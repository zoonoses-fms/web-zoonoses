<template>
  <div>
    <div class="row">
      <div class="col-sm-12 col-md-6">
        <slot name="table"> </slot>
      </div>
      <div class="col-sm-12 col-md-6">
        <div class="card">
          <div class="card-body">
            <form @submit.prevent="onSubmit">
              <div class="form-group">
                <label for="input-files">Arquivos:</label>
                <input
                  id="input-files"
                  ref="files"
                  class="form-control-file"
                  type="file"
                  name="files"
                  multiple
                  @change="changeFiles"
                />
              </div>

              <div class="justify-center card-actions">
                <a class="btn btn-wide btn-primary" @click="updateFiles">
                  Enviar
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <BCardGroup columns>
      <BCard v-for="(item, index) in filesProcessed" :key="index">
        <BCardText>
          <span>Upload do arquivo:</span>
        </BCardText>
        <BCardText>
          <b-progress
            :value="item.progress"
            :max="100"
            show-progress
            animated
          ></b-progress>
        </BCardText>
        <BCardText>
          <h3 class="flex card-title">
            <b-spinner label="Loading..."></b-spinner>
            Processando os dados de: {{ item.dataset.name }}
          </h3>
        </BCardText>
        <BCardText>
          <button class="btn btn-outline-dark" @click="removeFile(item)">
            <b-icon-x-circle></b-icon-x-circle>
          </button>
        </BCardText>
      </BCard>
    </BCardGroup>
  </div>
</template>

<script>
export default {
  name: 'UploadFileComponent',
  props: {
    resource: {
      type: String,
      default: 'dataset',
    },
    source: {
      type: String,
      default: 'datasus',
    },
    system: {
      type: String,
      default: 'sim',
    },
    initial: {
      type: String,
      default: 'pi',
    },
  },
  data() {
    return {
      textFiles: '',
      files: [],
      filesProcessed: [],
    };
  },
  computed: {
    url() {
      return `${this.resource}/${this.source}/${this.system}/${this.initial}`;
    },
  },
  watch: {},
  mounted() {},
  methods: {
    changeFiles(event) {
      this.files = Array.from(event.target.files);
      this.textFiles = '';
      if (this.files.length > 0) {
        for (const file of this.files) {
          this.textFiles = this.textFiles + ' ' + file.name;
        }
      }
    },
    removeFile(file) {
      const index = this.filesProcessed.indexOf(file);
      this.filesProcessed.splice(index, 1);
    },
    updateFiles() {
      this.filesProcessed = [];

      for (const index in this.files) {
        this.filesProcessed.push({
          index,
          dataset: this.files[index],
          status: 1,
          progress: 0,
        });
      }
      this.filesProcessed.forEach((file) => {
        this.updateFile(file);
      });
    },
    async updateFile(file) {
      try {
        const formData = new FormData();

        formData.append('datasets[]', file.dataset);
        const response = await this.$axios.$post(`${this.url}`, formData, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
          },
          timeout: 9999999,
          onUploadProgress: (event) => {
            file.progress = Math.round((event.loaded * 100) / event.total);

            console.log(
              `A imagem ${file.dataset.name} está ${file.progress}% carregada... `
            );
          },
        });
        this.removeFile(file);
        this.$bvToast.toast(`Arquivo ${file.dataset.name} carregado!`, {
          title: 'Sucesso',
          autoHideDelay: 5000,
          variant: 'success',
          solid: true,
        });
        this.$emit('upload', file);
        console.log(response);
      } catch (error) {
        this.removeFile(file);
        this.$bvToast.toast(
          `Ocorreu erro no carregamento do ${file.dataset.name}!`,
          {
            title: 'Error',
            autoHideDelay: 5000,
            variant: 'danger',
            solid: true,
          }
        );

        console.log(error);
      }
    },
  },
};
</script>

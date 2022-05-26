export default {
  data() {
    return {};
  },
  methods: {
    async getFeatures(dataset, featureType) {
      this.mapFeatures = [];

      const response = await this.$axios.get(
        `location/${featureType}/map/?initial=${dataset.initial}&year=${dataset.year}`
      );
      const maps = response.data;

      const mapFeatures = [];
      for (const map of maps) {
        mapFeatures.push({
          type: 'Feature',
          id: map.id,
          ibge_id_short: map.ibge_id_short,
          ibge_id: map.ibge_id,
          geometry: JSON.parse(map.geojson),
          name: map.name,
          properties: {
            name: map.name,
            ibge_id_short: map.ibge_id_short,
            ibge_id: map.ibge_id,
            population: map.population,
          },
        });
      }

      this.mapFeatures = [...mapFeatures];
    },
    async getOccurrences(dataset) {
      const response = await this.$axios.get(
        `dataset/serie/${dataset.source}/${dataset.system}/${dataset.initial}/${this.$route.params.id}/`,
        {
          params: this.paramsByLocation,
        }
      );

      const occurrences = [];

      for (const location of response.data) {
        occurrences.push({
          ibge_id: location[this.scopeLocation],
          count: location.count,
        });
      }

      this.occurrences = [...occurrences];
    },
  },
};

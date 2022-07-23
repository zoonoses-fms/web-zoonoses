export default {
  data() {
    return {
      urlGeocoder: 'geocoder/',
    };
  },
  methods: {
    async getGeocoding(keyword, provider) {
      const response = await this.$axios.get(this.urlGeocoder, {
        params: {
          keyword: `${keyword}, Teresina, PI`,
          provider,
        },
      });

      const features = [];

      for (const [index, feature] of response.data.entries()) {
        features.push({
          type: 'Feature',
          id: index,
          geometry: feature.geometry,
          properties: {
            display_name: `${feature.properties.streetName}, ${feature.properties.streetNumber}, ${feature.properties.subLocality}`,
            address: feature.properties.streetName,
            number: feature.properties.streetNumber,
            address_complement: '',
            neighborhood: feature.properties.subLocality,
          },
        });
      }

      return features;
    },
    generateGeoJson(item) {
      const feature = {
        type: 'Feature',
        id: item.id,
        geometry: JSON.parse(item.geometry),
        properties: {
          name: item.name,
          address: item.address,
          number: item.number,
          address_complement: item.address_complement,
          neighborhood: item.neighborhood,
          neighborhood_alias_id: item.neighborhood_alias_id,
        },
      };

      return feature;
    },
  },
};

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
        if(provider === 'google_place') {
          this.sliceAddress(feature);
        }
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
          neighborhood_alias: item.neighborhood_alias,
        },
      };

      return feature;
    },
    sliceAddress(feature) {
      const arrayAddress = feature.properties.formattedAddress.split(", ");
      console.log(arrayAddress);

      arrayAddress[0] = arrayAddress[0].split(" - ");
      if (arrayAddress[0].length > 1) {
        feature.properties.streetName = arrayAddress[0][0];
        feature.properties.subLocality = arrayAddress[0][1];
      } else {
        feature.properties.streetName = arrayAddress[0][0];
        arrayAddress[1] = arrayAddress[1].split(" - ");
        if (arrayAddress[1].length > 1) {
          feature.properties.streetNumber = arrayAddress[1][0];
          feature.properties.subLocality = arrayAddress[1][1];
        } else {
          feature.properties.subLocality = arrayAddress[0][0];
        }
      }

    }
  },
};

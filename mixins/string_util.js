export default {
  methods: {
    truncate(value, limit) {
      if (value.length > limit) {
        value = value.substring(0, limit - 3) + '...';
      }
      return value;
    },
    strippedHtml(value) {
      const regex = /(<([^>]+)>)/gi;
      return value.replace(regex, '');
    }
  }
}

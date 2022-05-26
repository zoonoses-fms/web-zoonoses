export default {
  computed: {
    isAdmin() {
      if (process.client) {
        if (this.$auth.loggedIn) {
          if (this.$auth.user.roles.some((role) => role.name === 'admin')) {
            return true;
          } else {
            return false;
          }
        }
      }
    },
    isMe() {
      if (process.client) {
        if (this.$auth.loggedIn) {
          if (this.$auth.user.id === this.user.id) {
            return true;
          } else {
            return false;
          }
        }
      }
    },
  },
};

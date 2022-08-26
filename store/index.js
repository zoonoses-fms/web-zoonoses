export const actions = {
  async nuxtServerInit({ commit }, { req }) {
    let auth = null;
    if (req.headers.cookie) {
      // cookie found
      try {
        // check data user login with cookie
        const { data } = await this.$axios.post('/me');
        // server return the data is cookie valid loggedIn is true
        auth = data; // set the data auth
      } catch (err) {
        // No valid cookie found
        auth = null;
      }
    }
    this.$auth.setUser(auth); // set state auth
  },
};

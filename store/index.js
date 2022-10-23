export const actions = {
  async nuxtServerInit({ commit }, { req }) {
    let auth = null;

    if (req.headers.cookie) {

      const output = {};
      req.headers.cookie.split(/\s*;\s*/).forEach(function (pair) {
        pair = pair.split(/\s*=\s*/);
        output[pair[0]] = pair.splice(1).join('=');
      });


      // const json = JSON.stringify(output, null, 4);
      // console.log(output['auth._token.local']);

      // cookie found
      if (output['auth._token.local'] !== 'false') {
        console.log(output['auth._token.local']);
        try {
          // check data user login with cookie
          const { data } = await this.$axios.post('/me');
          // server return the data is cookie valid loggedIn is true
          auth = data; // set the data auth
          this.$auth.setUser(auth);
        } catch (err) {
          // No valid cookie found
        }
      }

    }
    // this.$auth.setUser(auth); // set state auth
  },
};

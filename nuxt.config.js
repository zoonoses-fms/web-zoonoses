export default {
  env: {
    apiUrl: process.env.API_BASE_URL,
    baseUrl: process.env.BASE_URL,
    applicationToken: process.env.APPLICATION_TOKEN,
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'front-bootstrap',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~plugins/filter' },
    { src: '~/plugins/apexcharts', mode: 'client' },
    { src: '~/plugins/autocomplete-vue', mode: 'client' },
    { src: '~/plugins/easy-circular-progress', mode: 'client' },
    { src: '~/plugins/vuelayers', mode: 'client' },
    { src: '~/plugins/ol-ext', mode: 'client' },
    { src: '~/plugins/ol', mode: 'client' },
    { src: '~/plugins/v-click-outside', mode: 'client' },
    { src: '~/plugins/locale' },
    { src: '~/plugins/palette' },
    { src: '~/plugins/simple-statistics' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
    // '@nuxtjs/style-resources'
    '@nuxtjs/style-resources',
    // https://github.com/nuxt-community/moment-module
    [
      '@nuxtjs/moment',
      {
        defaultLocale: 'pt-br',
        locales: ['pt-br'],
        defaultTimezone: 'America/Fortaleza',
      },
    ],
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://github.com/lewyuburi/nuxt-validate
    '@nuxtjs/auth-next',
    [
      'nuxt-validate',
      {
        fieldsBagName: 'veeFields',
        lang: 'pt_BR',
        nuxti18n: {
          locale: {
            'pt-BR': 'pt_BR',
          },
          rules: [
            'required',
            'min',
            'max',
            'size',
            'length',
            'confirmed',
            'regex',
          ],
        },
      },
    ],
    // https://saintplay.github.io/vue-swatches/guide
    'vue-swatches/nuxt',
  ],

  bootstrapVue: {
    // Install the `IconsPlugin` plugin (in addition to `BootstrapVue` plugin)
    icons: true,
  },

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: `${process.env.API_BASE_URL}/api/v1`,
    // proxy: true,
    credentials: true,
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'pt-BR',
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  styleResources: {
    // your settings here
    sass: [],
    scss: ['assets/scss/style.scss'],
    less: [],
    stylus: [],
    hoistUseStatements: true, // Hoists the "@use" imports. Applies only to "sass", "scss" and "less". Default: false.
  },

  // Config nuxt-validate

  auth: {
    cookie: {
      prefix: 'auth.',
      options: {
        path: '/',
        domain: 'localhost',
        secure: true,
      },
    },
    redirect: {
      login: '/auth/login',
      logout: '/',
      callback: '/auth/login',
      home: '/',
    },
    strategies: {
      local: {
        scheme: 'refresh',
        // url: `${process.env.API_BASE_URL}/api/v1`,
        token: {
          type: 'Bearer',
          property: 'access_token',
          maxAge: 60 * 24 * 6,
          global: true,
          required: true,
        },
        refreshToken: {
          property: 'access_token',
          data: 'refresh_token',
          maxAge: 60 * 60 * 24 * 30,
        },
        user: {
          property: false,
          autoFetch: true,
        },
        endpoints: {
          login: { url: '/login/', method: 'post' },
          logout: { url: '/logout/', method: 'post' },
          refresh: { url: '/refresh/', method: 'post' },
          user: { url: '/me/', method: 'post' },
        },
      },
    },
  },

  router: {
    // linkExactActiveClass: 'active',
    middleware: ['auth'],
    extendRoutes(routes, resolve) {
      routes.push({
        name: 'datasets-loads',
        path: '/datasets/load/:source/:system/:initial',
        component: '~/pages/datasets/_load.vue',
      });
    },
  },
};

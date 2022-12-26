// import path from 'path';
// import fs from 'fs';
export default {
  env: {
    apiUrl: process.env.API_BASE_URL,
    baseUrl: process.env.BASE_URL,
    platformUuid: process.env.PLATFORM_UUID,
    platformPassword: process.env.PLATFORM_PASSWORD,
  },
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'Zoonoses',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  // https://nuxtjs.org/docs/features/loading/
  loading: {
    color: '#e95e38',
    height: '6px',
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ['assets/scss/style.scss'],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '~plugins/axios.js' },
    { src: '~plugins/filter' },
    // { src: '~/plugins/apexcharts', mode: 'client' },
    { src: '~/plugins/autocomplete-vue', mode: 'client' },
    // { src: '~/plugins/easy-circular-progress', mode: 'client' },
    // { src: '~/plugins/v-click-outside', mode: 'client' },
    // { src: '~/plugins/ol', mode: 'client' },
    { src: '~/plugins/locale' },
    { src: '~/plugins/palette' },
    { src: '~/plugins/simple-statistics' },
    // { src: '~/plugins/offline.js', mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://github.com/nuxt-community/eslint-module
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
    // https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
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
    bootstrapCSS: false, // Or `css: false`
    bootstrapVueCSS: false,
    icons: false,
    components: [
      'BNavbar',
      'BNavbarBrand',
      'BNavbarToggle',
      'BNavbarNav',
      'BNavItem',
      'BCollapse',
      'BPopover',
      'BAvatar',
      'BButton',
      'BToast',
      'BButtonGroup',
      'BDropdownItem',
      'BNavItemDropdown',
      'BForm',
      'BFormGroup',
      'BFormInput',
      'BFormCheckbox',
      'BFormRadioGroup',
      'BFormSelect',
      'BFormSelectOption',
      'BInputGroup',
      'BInputGroupAppend',
      'BPagination',
      'BOverlay',
      'BTable',
      'BCard',
      'BTabs',
      'BTab',
      'BCardHeader',
      'BCardBody',
      'BCardGroup',
      'BModal',
      'BIconMap',
      'BIconPlus',
      'BIconChevronRight',
      'BIconHouse',
      'BIconSignpostSplit',
      'BIconPencil',
      'BIconPeople',
      'BIconSearch',
      'BIconBookmark',
      'BIconClipboardCheck',
      'BIconPieChart',
      'BIconArrowReturnRight',
      'BIconLayoutTextSidebar',
      'BIconBarChart',
      'BIconTrash',
      'BIconPrinter',
      'BIconPersonBadgeFill',
      'BIconCurrencyDollar',
      'BIconXCircle',
      'BIconCheckCircle',
      'BIconExclamationCircle',
      'BIconPinMap',
    ],
    directives: [
      'VBModal',
      'VBPopover',
      'VBTooltip',
      'VBScrollspy',
      'VBToggle',
    ],
    componentPlugins: [
      'LayoutPlugin',
      'FormPlugin',
      'FormCheckboxPlugin',
      'FormInputPlugin',
      'FormRadioPlugin',
      'ToastPlugin',
      'ModalPlugin',
    ],
    directivePlugins: [
      'VBPopoverPlugin',
      'VBTooltipPlugin',
      'VBScrollspyPlugin',
    ],
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
    meta: {
      mobileAppIOS: true,
      name: 'Zoonoses',
      author: 'Thiago Pinto Dias',
      lang: 'pt-BR',
    },
    manifest: {
      name: 'Zoonoses',
      lang: 'pt-BR',
      background_color: '#fff',
    },

    workbox: {
      // dev: true,
      // debug: true,
      // importScripts: ['sw/storage.js'],
      runtimeCaching: [
        {
          urlPattern: `${process.env.API_BASE_URL}/api/.*`,
          // handler: 'StaleWhileRevalidate',
          strategyOptions: {
            cacheName: 'api-cache',
          },
          method: 'GET',
        },
      ],
    },
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: [
      ...['vue-apexcharts'],
      ...['claygl', 'echarts', 'echarts-gl', 'zrender'],
      ...[
        'ol/Map',
        'ol/View',
        'ol/layer/Tile',
        'ol/layer/Vector',
        'ol/source/Vector',
        'ol/Overlay',
        'ol/source/OSM',
        'ol/style/Style',
        'ol/style/Text',
        'ol/style/Fill',
        'ol/geom/Point',
        'ol/style/Stroke',
        'ol/style/Circle',
        'ol/style/RegularShape',
        'ol/style/Icon',
        'ol/format/GeoJSON',
        'ol/Feature',
        'ol/interaction',
        'ol/extent',
        'ol/color',
        'ol-ext/featureanimation/FeatureAnimation',
        'ol-ext/render/Pulse',
        'ol-ext/render/AnimExtent',
        'ol-ext/featureanimation/Zoom',
        'ol-ext/featureanimation/None',
        'ol-ext/control/Legend',
        'ol-ext/legend/Legend',
        'ol-ext/legend/Item',
        'ol/easing',
        'hex-to-rgba',
      ],
    ],
    babel: {
      compact: true,
    },
  },

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
        domain: process.env.DOMAIN,
        secure: false,
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
          property: 'refresh_token',
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
        name: 'datasets_loads',
        path: '/datasets/load/:source/:system/:initial',
        component: '~/pages/datasets/_load.vue',
      });
      routes.push({
        name: 'dashboards_show',
        path: '/dashboards/show/:source/:system/:initial',
        component: '~/pages/dashboards/_show.vue',
      });
    },
  },
  /*
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'localhost.pem')),
    },
  },
  */
};

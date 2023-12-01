// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typescript: {
    strict: true,
    typeCheck: true,
  },
  srcDir: 'src/',
  runtimeConfig: {
    menuUrl: '',
    freshflowUrl: '',
    microserviceUrl: '',
    authrefUrl: '',
    accessorUrl: '',
    pathnameUtil: '',
    pathnameStock: '',
    public: {
      baseApiUrl: '',
      baseApiUtil: `${process.env.NUXT_PUBLIC_BASE_API_URL}${process.env.NUXT_PUBLIC_PATHNAME_UTIL}`,
      baseApiStock: `${process.env.NUXT_PUBLIC_BASE_API_URL}${process.env.NUXT_PUBLIC_PATHNAME_STOCK}`,
      FS_LANG: 'EN',
    },
  },
  app: {
    head: {
      title: 'Stock Management',
      meta: [
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, shrink-to-fit=no',
        },
      ],
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: 'sba-icon.ico',
        },
        {
          rel: 'preload',
          type: 'font/ttf',
          href: 'fonts/Prompt-Regular.ttf',
          as: 'font',
        },
        {
          rel: 'stylesheet',
          href: 'fonts.css',
        },
      ],
      script: [
        { type: 'text/javascript', src: '../js/jquery-3.6.4.min.js' },
        { type: 'text/javascript', src: '../js/kendo.all.min.js' },
      ],
    },
  },
  css: ['assets/scss/index.scss'],
  build: {
    transpile: ['mdb-vue-ui-kit'],
  },
  plugins: [{ src: '~/plugins/axios.ts', mode: 'client' }],
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  modules: [
    '@sidebase/nuxt-session',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    [
      '@vee-validate/nuxt',
      {
        autoImports: true,
        componentNames: {
          // Form: 'VeeForm',
          Field: 'VeeField',
        },
      },
    ],
  ],
});

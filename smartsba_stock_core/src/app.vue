<template>
  <div class="h-100">
    <app-loader v-if="showHideSpinner" />
    <nuxt-layout :name="AppState.getLayout" class="container-xxxl">
      <div id="main-apps">
        <nuxt-page />
      </div>
    </nuxt-layout>
  </div>
</template>

<script setup lang="ts">
import { useAppState } from '~/stores/AppState';
console.log('✨App.vue!');
const nuxtApp = useNuxtApp();
const showHideSpinner: Ref<boolean> = ref(true);
const AppState = useAppState();
nuxtApp.hook('page:start', (): void => {
  console.log('✨Page is start...');
  showHideSpinner.value = true;

  console.log('# showHideSpinner: ', showHideSpinner.value);
});
nuxtApp.hook('page:finish', (): void => {
  console.log('✨Page is finished!');

  showHideSpinner.value = false;

  setTimeout(() => {
    showHideSpinner.value = false;
    console.log('# showHideSpinner: ', showHideSpinner.value);
  }, 1000);
});

// const isMenuNavigate = ref(true);
//   console.log("# isMenuNavigate: " + isMenuNavigate.value)
//   console.log('# layout: ', (!isMenuNavigate.value) ? "default" : "sbmenu")
//   definePageMeta({
//     // middleware: "authen",
//     layout: (!isMenuNavigate.value) ? "default" : "sbmenu"
//     // layout: "sbmenu"
//   });
</script>

<script lang="ts">
console.log('[app.vue] 😎 | script!');
export default {
  data() {
    console.log('[app.vue] 😎 | data!');
    return {};
  },
  beforeCreate() {
    console.log('[app.vue] 😎 | beforeCreate!');
  },
  mounted() {
    console.log('[app.vue] 😎 | mounted!');
  },
};
</script>
<style>
html,
body {
  font-family: 'Prompt';
  height: 100%;
  margin: 0px;
}

#__nuxt {
  height: inherit;
  max-height: inherit;
}

.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>

<style scoped>
#mainapps.hide {
  opacity: 0;
}

@media (min-width: 2048px) {
  .container-xxxl {
    --mdb-gutter-x: 1.5rem;
    --mdb-gutter-y: 0;
    width: 100%;
    padding-right: calc(var(--mdb-gutter-x) * 0.5);
    padding-left: calc(var(--mdb-gutter-x) * 0.5);
    margin-right: auto;
    margin-left: auto;

    max-width: 2048px;
  }
}
</style>

<template>
  <div class="h-100">
    <AppHeader :is-menu-navigate="false" />
    <div class="layout-page-content d-flex">
      <div class="w-100">
        <main class="v-container px-4 pt-3 pb-4">
          <div id="main-program">
            <slot />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
const isMenuNavigate: Boolean = false;
export default {
  data() {
    return {
      fsUserName: 'Nutchayapat Intaramat (CHECKER)',
      isMenuNavigate,
    };
  },
  mounted() {
    console.log('Mounted 🔥');
    window.addEventListener('resize', this.getDimensions);
  },
  unmounted() {
    console.log('Mounted 🔥');
    window.removeEventListener('resize', this.getDimensions);
  },
  methods: {
    getDimensions() {
      console.log('Get dimensions!!');
    },
  },
};
</script>

<style scoped></style>

<template>
  <div class="h-100">
    <AppHeader
      :is-menu-navigate="true"
      :is-hide-nav="toggleNavSide"
      @toggle="doToggleNavSide()"
    />
    <div class="layout-page-content d-flex">
      <div class="left-col">
        <!-- Nav SideMenu elements -->
        <aside class="h-100">
          <!-- Nav SideMenu Content elements -->
          <AppSideMenu :toggle="toggleNavSide" />
        </aside>
      </div>
      <div class="right-col">
        <main class="v-container px-4 pt-3 pb-4">
          <div id="main-program">
            <slot />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const toggleNavSide: Ref<boolean> = ref(true);
const doToggleNavSide = (): void => {
  console.log('# do ToggleNavSide!!!');
  toggleNavSide.value = !toggleNavSide.value;
};

// const getDimensions = (): void => {
//   console.log('Dimentsions 🔥!');
// };

// onMounted(() => {
//   console.log('Mounted 🔥!');
//   window.addEventListener('resize', getDimensions());
// });

// onBeforeMount(() => {
//   console.log('UnMounted 💣!');
//   try {
//     // window.removeEventListener('resize', this.getDimensions);
//     // const response = await getObjectiveLookup();
//     // if (response.length > 0) dataList.value = response;
//     // console.log('# objective lookup: ', response);
//   } catch (err) {
//     console.log('👹Found Error!!');
//   }
// });
</script>

<style lang="scss">
.layout-wrapper.layout-nav-type-vertical .layout-content-wrapper {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-block-size: calc(var(--vh, 1vh) * 100);
  transition: padding-inline-start 0.2s ease-in-out;
  will-change: padding-inline-start;
}

.layout-page-content {
  overflow: hidden;
  height: calc(100% - 57px);
}

@media (min-width: 576px) {
  /* .col-sm {
        flex: 1 0 0%;
    } */
}

.left-col {
  flex: 0 0 auto;
  width: 25%;

  max-width: 300px;
}

.right-col {
  flex: 0 0 auto;
  width: 75%;

  min-width: calc(75% - 300px);
}

.layout-page-content > .right-col > main {
  overflow-x: hidden;
  overflow-y: scroll;
  height: 100%;
  min-height: 100%;
}

@media (min-width: 1367px) {
  $nav-width-default: 300px;
  .left-col {
    width: $nav-width-default;
  }
  .right-col {
    width: calc(100% - $nav-width-default);
  }
}
</style>

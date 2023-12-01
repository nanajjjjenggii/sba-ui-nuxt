<template>
  <header class="v-container">
    <div class="d-flex w-100">
      <!-- Nav SideMenu Top elements -->
      <div class="left-col">
        <header :class="`navbar navbar-dark ${!isMenuNavigate && 'shadow-0'}`">
          <div class="sba-header d-flex">
            <img
              class="sba-logo"
              src="~/assets/images/logo.png"
              alt="SBA Image Logo"
            />
            <span class="sba-title">SMART SBA</span>
          </div>
        </header>
      </div>
      <div class="right-col">
        <nav :class="`navbar navbar-dark ${!isMenuNavigate && 'shadow-0'}`">
          <div class="container-fluid justify-content-end">
            <!-- Left elements -->
            <div v-if="isMenuNavigate" class="position-absolute start-0">
              <button
                class="navbar-toggler text-white"
                type="button"
                :title="'Hide Navigation'"
                aria-label="Toggle navigation"
                @click="emit('toggle')"
              >
                <i class="fa-lg fas fa-bars"></i>
              </button>
            </div>
            <!-- Right elements -->
            <div class="d-flex bg-white px-3 py-1 rounded-pill">
              <span class="material-icons-round">person</span>
              <strong id="usr_fsusername">
                {{ fsAccessor.getUserName }} ({{ fsAccessor.data.fsUser }})
              </strong>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>
<script setup lang="ts">
import { AccessorStores } from '~/stores/Accessor';
interface AppHeaderProps {
  isMenuNavigate?: boolean;
  isHideNav?: boolean;
}

const props = withDefaults(defineProps<AppHeaderProps>(), {
  isMenuNavigate: true,
  isHideNav: false,
});
console.log('# props: ', props);

const fsAccessor = AccessorStores();
console.log('✨✨✨ fsAccessor: ', fsAccessor);

const emit = defineEmits<{ (e: 'toggle'): void }>();
</script>

<style scoped>
/* $red: #833; */

.sba-header {
  margin: auto 0.75em;
}

.sba-header > .sba-logo {
  top: 0px;
  width: 48px;
  margin: -0.75em 0;
  position: relative;
  object-fit: contain;
}

.sba-header > .sba-title {
  text-overflow: ellipsis;
  overflow: hidden;
  /* font-size: 22px; */
  font-size: 1.75em;
  color: #ecf0f1 !important;
  padding-left: 0.5em;
}

.navbar {
  height: 57px;
  min-height: 57px;
}

.left-col {
  width: 100%;
  max-width: 300px;
}

.right-col {
  width: calc(100% - 300px);
  min-width: calc(100% - 300px);
}

.navbar-dark {
  /* #333333 -> #404040 */
  background: #333333;
}
</style>

import { defineStore, createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

interface AppState {
  submenu: boolean;
}

export const useAppState = defineStore('appstate', {
  state: (): AppState => ({
    submenu: false,
  }),
  getters: {
    getSubmenu: (state): boolean => state.submenu,
    getLayout: (state): string => (state.submenu ? 'sbmenu' : 'default'),
  },
  actions: {
    setSubmenu(submenu: boolean): void {
      this.$state.submenu = submenu;
    },
  },
  persist: {
    storage: persistedState.sessionStorage,
  },
});

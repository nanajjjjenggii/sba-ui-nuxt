import { defineStore, createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { GenericObject } from '~/Types/type';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

interface ProgramPermission {
  bylevel: boolean;
  import: boolean;
  bygroup: boolean;
  insert: boolean;
  update: boolean;
  retrieve: boolean;
  onlymybranch: boolean;
  launch: boolean;
  department: boolean;
  delete: boolean;
  export: boolean;
}

interface Accessor {
  fskey: string;
  fsUser: string;
  fsUserName: string;
  fsLanguage: string;
  fsUserStatus: string;
  fsSystemDate: string;
  fsRoleName: string[];
  fsRoles: string[];
  fsUserProject: string[];
}

interface UserInfo {
  fsUserName: string;
  age: number;
}

interface EntryInfo {
  fsProggroup: string;
  taskname: string;
}

export const AccessorStores = defineStore('accessor', {
  state: (): {
    data: Accessor;
    permission: GenericObject<ProgramPermission>;
    entryInfo: EntryInfo;
  } => ({
    data: {
      fskey: '',
      fsUser: '',
      fsUserName: '',
      fsLanguage: '',
      fsUserStatus: '',
      fsSystemDate: '',
      fsRoleName: [],
      fsRoles: [],
      fsUserProject: [],
    },
    permission: {},
    entryInfo: {
      fsProggroup: '',
      taskname: '',
    },
  }),
  getters: {
    getString: (state): string => state.toString(),
    getUser: (state) => state.data.fsUser,
    getUserName: (state) => state.data.fsUserName,
    getLanguage: (state) => state.data.fsLanguage,
    getUserStatus: (state) => state.data.fsUserStatus,
    getSystemDate: (state) => state.data.fsSystemDate,
    getRoleName: (state) => state.data.fsRoleName,
    getRoles: (state) => state.data.fsRoles,
    getFsKey: (state) => state.data.fskey,
  },
  actions: {
    setData(data: Accessor) {
      this.data = data;
    },
    setFSKey(key: string) {
      this.data.fskey = key;
    },
    setFsProggroup(fsProggroup: string) {
      this.entryInfo.fsProggroup = fsProggroup;
    },
    addPermission(
      group: string,
      itemname: string,
      data: GenericObject<string>,
    ) {
      let perm = this.permission[getPermissionKey(group, itemname)];
      if (!perm) {
        perm = {
          bylevel: false,
          import: false,
          bygroup: false,
          insert: false,
          update: false,
          retrieve: false,
          onlymybranch: false,
          launch: false,
          department: false,
          delete: false,
          export: false,
        };
        this.permission[getPermissionKey(group, itemname)] = perm;
      }

      let key: keyof ProgramPermission;
      for (key in perm) {
        perm[key] = data[key] === 'true' || false;
      }
    },
    getPermission(group: string, itemname: string): ProgramPermission {
      return this.permission[getPermissionKey(group, itemname)];
    },
    getPermissionItem(itemname: string): ProgramPermission {
      return this.permission[
        getPermissionKey(this.entryInfo.fsProggroup, itemname)
      ];
    },
  },
  // persist: true,
  persist: {
    storage: persistedState.sessionStorage,
  },
});

function getPermissionKey(group: string, itemname: string) {
  return group.toUpperCase() + ':' + itemname.toUpperCase();
}

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      // for initially empty lists
      userList: [] as UserInfo[],
      // for data that is not yet loaded
      user: null as UserInfo | null,
    };
  },
});

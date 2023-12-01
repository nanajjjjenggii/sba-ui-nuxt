<template>
  <div id="menu-side" class="h-100">
    <div class="h6 d-flex justify-content-between p-3 mb-0 fw-bold">
      <span class="text-white">NAVIGATION</span>
      <button
        id="side-menu-closebtn"
        title="close"
        class="bg-transparent border-0 text-white"
        @click="sideMenuToggle"
      >
        <i class="fas fa-lg fa-times"></i>
      </button>
    </div>
    <ul class="list-group rounded-0 nav-item">
      <template v-for="item in menuLists" :key="item.id">
        <li
          v-if="item.submenu.length == 0"
          :id="item.id"
          class="list-group-item px-0 border-0 text-light"
          :class="{
            active: mainMenuActive === item.id,
          }"
          :to="`/${item.id}`"
          @click="routerLinkByMenues($event)"
        >
          <div class="px-3 pe-none">
            <span class="icon"><em :class="item.menuicon"></em></span>
            <span class="ps-2">{{ item.text }}</span>
          </div>
        </li>
        <li
          v-else
          :id="`${item.id}-submenu`"
          class="list-mainmenu-wrapper list-group-item p-0 border-0 rounded-0"
          :class="{
            expanded: mainMenuExpanded.includes(`${item.id}-submenu`),
            active: mainMenuActive === `${item.id}-submenu`,
          }"
        >
          <div
            class="d-flex justify-content-between px-3 py-2"
            :href="`#${item.id}-submenu-wrapper`"
            role="button"
            :aria-expanded="mainMenuExpanded.includes(`${item.id}-submenu`)"
            :multi-menu="true"
            @click="toggleExpanded"
          >
            <div>
              <em :class="item.menuicon"></em>
              <span class="ps-2">{{ item.text }}</span>
            </div>
            <em class="fas fa-angle-down rotate-icon" />
          </div>
          <ul
            :id="`${item.id}-submenu-wrapper`"
            class="list-submenu-wrapper sidenav-collapse border-0 rounded-0"
            :aria-expanded="mainMenuExpanded.includes(`${item.id}-submenu`)"
            :style="{
              maxHeight: elementOffsetHeight(`${item.id}-submenu`),
            }"
          >
            <div :id="`${item.id}-submenu-inner`" class="list-submenu-inner">
              <template v-for="subitem of item.submenu" :key="subitem.index">
                <div
                  :id="`${item.id}-${subitem.id}`"
                  class="list-submenu-item list-group-item border-0"
                  :class="{
                    active: subMenuActive === `${item.id}-${subitem.id}`,
                  }"
                  :to="`/${subitem.id}/`"
                  :submenu="true"
                  @click="routerLinkByMenues($event)"
                >
                  <div class="ps-3 pe-none">{{ subitem.text }}</div>
                </div>
              </template>
            </div>
          </ul>
        </li>
      </template>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface MenuItem {
  id: string;
  text: string;
  index: number;
  firstpage?: string;
  type?: string;
  imageUrl?: string;
}
interface SubMenu extends MenuItem {
  permissions: { [key: string]: string };
}

interface MainMenu extends MenuItem {
  menuicon: string;
  submenu: Array<SubMenu | never>;
}

const menuLists = ref<Array<never | MainMenu>>([]);
const getMenuFile = async () => {
  console.log('# call | getMenuFile');
  let menues;
  try {
    const { data: response } = await useFetch(() => `/api/authref/menu`, {
      params: {
        subGroup: 'SBSE602M.navigate',
      },
    });
    const content = response.value?.content;
    menues = content?.menu;
  } catch (error) {
    console.log('# error, ', error);
    console.error(error);
  }
  return menues ?? [];
};

const mainMenuActive = ref<string>('');
const subMenuActive = ref<string>('');
const mainMenuExpanded = ref<string[]>([]);
const routerLinkByMenues = async (event: any) => {
  const prog = event.target;
  const path = prog.getAttribute('to');
  const submenu = prog.getAttribute('submenu') === 'true';
  const { data, error } = await useFetch(path);
  if (data.value && !error.value) {
    await navigateTo({
      path,
    });
    if (submenu) {
      const dir = prog.closest('.list-mainmenu-wrapper');
      mainMenuActive.value = dir.id;
      subMenuActive.value = prog.id;
    } else {
      mainMenuExpanded.value = [];
      mainMenuActive.value = prog.id;
      subMenuActive.value = '';
    }
  } else {
    const errorMessage = error.value?.statusMessage || 'Page Not Found';
    alert(errorMessage);
    // popup.alert({
    //   message: errorMessage,
    //   callback: () => {

    //   }
    // });
  }
};

const sideMenuToggle = (): void => {
  console.log('# SideMenuToggle!!!!!!!!!');
};

const toggleExpanded = (event: any) => {
  const divElement: any = event.target;
  const divParentElement = divElement.parentElement;
  const isExpanded = divElement.getAttribute('aria-expanded') === 'false';
  if (
    mainMenuExpanded.value.length > 1 &&
    mainMenuActive.value &&
    !subMenuActive.value
  ) {
    // mainMenuExpanded.value.pop();
    const idx = mainMenuExpanded.value.findIndex(
      (item) => item !== mainMenuActive.value,
    );
    mainMenuExpanded.value.splice(idx, 1);
  }

  if (!isExpanded) {
    const idx = mainMenuExpanded.value.findIndex(
      (item) => item === divParentElement.id,
    );
    mainMenuExpanded.value.splice(idx, 1);
  } else {
    mainMenuExpanded.value.push(divParentElement.id);
  }
};

const elementOffsetHeight = (element: any): string => {
  const isExpanded = mainMenuExpanded.value.includes(`${element}`);
  const divElement = document.getElementById(`${element}-inner`);
  let height = 0;
  if (isExpanded) {
    height = divElement?.offsetHeight ?? 0;
  }
  return height + 'px';
};

onMounted(async () => {
  const resp = await getMenuFile();
  if (resp) menuLists.value = resp;
  const findItem = resp.find(
    (item: { [key: string]: any }) =>
      item.type === 'program-directory' && item.firstpage === 'true2',
  );
  const initialFirstpage = findItem
    ? findItem.id
    : resp.find(
        (item: { [key: string]: any }) => item.type === 'program-directory',
      )?.id;
  console.log('# initialFirstpage: ', initialFirstpage);
  if (initialFirstpage) {
    mainMenuActive.value = initialFirstpage;
    await navigateTo(`/${initialFirstpage}`, { replace: true });
  }
});
</script>

<style lang="scss" scoped>
#menu-side {
  $sidemenu-bg: #2a3f54;
  $sidemenu-item-bg: #243547;
  $sidemenu-nav-color: #020081;
  $sidemenu-item-color: rgba(var(--mdb-light-rgb));
  $sidemenu-item-active-bg: #314152;
  $sidemenu-item-active-color: #f6c700;
  $sidemenu-item-hover-color: #ff9800;
  $sidemenu-item-hover-solid: 4px solid $sidemenu-item-hover-color;
  $sidemenu-item-active-solid: 4px solid $sidemenu-item-active-color;
  $sidemenu-submenu-active-bg: #243547;
  $sidemenu-submenu-list-color: #425668;
  $sidemenu-bg-opacity: #ffffff;

  /* MDB's Color Customization */
  --mdb-list-group-bg: $sidemenu-item-bg;
  background-color: $sidemenu-bg;

  .list-group-item {
    cursor: pointer;
    color: $sidemenu-item-color;
    background-color: $sidemenu-bg;
    transition: border-right 0.3s;
    margin-top: 0;

    &:hover {
      border-right: $sidemenu-item-hover-solid !important;
      background-color: rgba($sidemenu-bg-opacity, 0.06);
    }
    &.active {
      color: $sidemenu-item-active-color !important;
      border-right: $sidemenu-item-active-solid !important;
      background-color: rgba($sidemenu-bg-opacity, 0.06);
    }
    &.list-mainmenu-wrapper {
      &.expanded {
        border-right: $sidemenu-item-hover-solid !important;
      }
      &.active {
        border-right: $sidemenu-item-active-solid !important;
        > .d-flex {
          color: $sidemenu-item-active-color;
          background: rgba($sidemenu-item-active-bg, 0.6);
        }
      }
      > .d-flex {
        color: $sidemenu-item-color;
        > .fa-angle-down.rotate-icon {
          align-self: center;
          transform: rotate(0deg);
          transition: transform 0.3s;
          transition-property: transform;
        }
        &[aria-expanded='true'] {
          text-shadow: rgba(0, 0, 0, 0.25) 0 -1px 0;
          background: -webkit-gradient(
              linear,
              left top,
              left bottom,
              from(#334556),
              to(#2c4257)
            ),
            #2a3f54;
          background: linear-gradient(#334556, #2c4257), #2a3f54;
          -webkit-box-shadow: rgba(0, 0, 0, 0.25) 0 1px 0,
            inset rgba(255, 255, 255, 0.16) 0 1px 0;
          box-shadow: rgba(0, 0, 0, 0.25) 0 1px 0,
            inset rgba(255, 255, 255, 0.16) 0 1px 0;

          > .fa-angle-down.rotate-icon {
            transform: rotate(-180deg);
          }
        }
        * {
          pointer-events: none !important;
        }
      }
      > .list-submenu-wrapper {
        background: $sidemenu-item-bg;
        color: $sidemenu-item-color;
        padding-left: 0;
        max-height: 0;
        overflow: hidden;
        -webkit-transition: max-height 0.25s ease-out;
        transition: max-height 0.25s ease-out;
        .list-submenu-item.list-group-item {
          background-color: rgba($sidemenu-submenu-active-bg, 0.9);
          padding-right: 9px;
          color: rgba(255, 255, 255, 0.75);
          font-size: 12px;
          &:first-child {
            margin-top: 1px;
          }
          &:hover {
            border-right: none !important;
            background-color: $sidemenu-item-active-bg;
          }
          &::after {
            border-left: 1px solid $sidemenu-submenu-list-color;
            bottom: 0;
            content: '';
            position: absolute;
            top: 0;
            left: 22px;
          }
          &:last-child::after {
            height: 50%;
          }
          &::before {
            background: $sidemenu-submenu-list-color;
            bottom: auto;
            content: '';
            height: 8px;
            margin-top: 6px;
            position: absolute;
            right: auto;
            width: 8px;
            z-index: 1;
            border-radius: 50%;
            left: 18.5px;
          }
          &.active {
            color: $sidemenu-item-active-color;
            background: $sidemenu-item-active-bg;
            border-right: 0 !important;
            &::before {
              background: $sidemenu-item-active-color;
            }
          }
        }
      }
    }
    .sidenav-item {
      margin-left: 5px;
      margin-right: 5px;
      &:first-child {
        margin-top: 4px;
      }
    }
  }
}
</style>

<template>
  <Teleport to="#__nuxt">
    <MDBModal
      id="popup-center-modal"
      v-model="visibleModal"
      tabindex="-1"
      labelledby="popup-center-titlemodal"
      centered
      :duration="0"
      :keyboard="false"
      static-backdrop
      @hide="if (cancelbtn.clicked) cancelbtn.clicked();"
    >
      <MDBModalHeader>
        <MDBModalTitle id="popup-center-titlemodal">
          <div class="d-flex align-items-end">
            <span
              v-if="icon"
              :class="`title-icon text-${confirmbtn.color} me-1`"
              v-html="icon"
            ></span>
            <span
              v-else
              :class="`title-icon material-icons-round text-${confirmbtn.color} me-1 fa-2x`"
              >{{ iconname }}</span
            >
            <slot name="title"> Product in the cart </slot>
          </div>
        </MDBModalTitle>
      </MDBModalHeader>
      <MDBModalBody>
        <slot name="body"></slot>
      </MDBModalBody>
      <MDBModalFooter>
        <slot name="footer">
          <MDBBtn
            class="d-flex text-center align-items-center justify-content-center"
            :color="cancelbtn.color"
            @click="
              if (cancelbtn.clicked) cancelbtn.clicked();
              visibleModal = false;
            "
          >
            <span class="material-icons-round me-1">clear</span> NO
          </MDBBtn>
          <MDBBtn
            class="d-flex text-center align-items-center justify-content-center"
            :color="confirmbtn.color"
            @click="handleConfirmFunctions"
          >
            <span class="material-icons-round me-1">done</span> YES
          </MDBBtn>
        </slot>
      </MDBModalFooter>
    </MDBModal>
  </Teleport>
</template>

<script setup lang="ts">
import {
  MDBModal,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBBtn,
} from 'mdb-vue-ui-kit';
import { BtnAction } from '~/utils/popup';

const prop = withDefaults(
  defineProps<{
    visible: boolean;
    icon: string;
    iconname: string;
    confirmbtn?: BtnAction;
    cancelbtn?: BtnAction;
  }>(),
  {
    visible: false,
    iconname: '',
    confirmbtn: () => {
      return {
        color: 'primary',
        clicked: () => {},
      };
    },
    cancelbtn: () => {
      return {
        color: 'grey',
        clicked: () => {},
      };
    },
  },
);
const visibleModal = ref(false);
onMounted(() => {
  setTimeout(() => {
    visibleModal.value = prop.visible;
  }, 100);
});

watch(
  () => prop.visible,
  () => {
    console.log('prop visible changed', prop.visible);
    visibleModal.value = prop.visible;
  },
);

const handleConfirmFunctions = async () => {
  if (prop.confirmbtn.clicked) await prop.confirmbtn.clicked();
  visibleModal.value = false;
};
</script>
<style lang="scss">
#popup-center-modal {
  .modal-title {
    --mdb-modal-header-padding: 1rem 1rem 1rem 1.5rem;
    .title-icon {
      // // font-size: 2.5rem !important;
      // line-height: 1;
      line-height: 1;
      align-self: center;
      font-size: 1.8em;
    }
  }
  .modal-footer {
    --mdb-modal-footer-gap: 0rem;
    button {
      min-width: 115px;
      > .material-icons-round {
        font-size: 1.5em;
      }
    }
  }
}
</style>

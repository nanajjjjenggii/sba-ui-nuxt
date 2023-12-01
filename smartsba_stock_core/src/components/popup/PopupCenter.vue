<template>
  <MDBModal
    id="exampleSideModal1"
    v-model="visibleModal"
    tabindex="-1"
    labelledby="exampleSideModalLabel1"
  >
    <MDBModalHeader color="info" class="text-white">
      <MDBModalTitle id="exampleSideModalLabel1">
        <slot name="title"> Product in the cart </slot>
      </MDBModalTitle>
    </MDBModalHeader>
    <MDBModalBody>
      <slot name="body">
        <MDBRow>
          <MDBCol col="3" class="text-center">
            <i class="fas fa-shopping-cart fa-4x text-info"></i>
          </MDBCol>
          <MDBCol col="9">
            <p>Do you need more time to make a purchase decision?</p>
            <p>
              No pressure, your product will be waiting for you in the cart.
            </p>
          </MDBCol>
        </MDBRow>
      </slot>
    </MDBModalBody>
    <MDBModalFooter>
      <slot name="footer">
        <MDBBtn color="info"> Go to the cart </MDBBtn>
        <MDBBtn color="outline-info" @click="visibleModal = false">
          Close
        </MDBBtn>
      </slot>
    </MDBModalFooter>
  </MDBModal>
</template>

<script setup lang="ts">
import {
  MDBModal,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBBtn,
  MDBRow,
  MDBCol,
} from 'mdb-vue-ui-kit';
import { ref } from 'vue';

const prop = withDefaults(defineProps<{ visible: boolean }>(), {
  visible: true,
});
const visibleModal = ref(false);
onMounted(() => {
  setTimeout(() => {
    visibleModal.value = prop.visible;
  }, 100);
});
</script>

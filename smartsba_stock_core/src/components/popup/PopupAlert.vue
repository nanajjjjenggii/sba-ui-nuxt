<template>
  <MDBModal
    id="popup-center-modal"
    v-model="exampleSideModal1"
    position="top-right"
    direction="right"
    tabindex="-1"
    labelledby="popup-center-title"
  >
    <MDBModalHeader color="info" class="text-white">
      <MDBModalTitle id="popup-center-title">
        Product in the cart
      </MDBModalTitle>
    </MDBModalHeader>
    <MDBModalBody>
      <MDBRow>
        <MDBCol col="3" class="text-center">
          <i class="fas fa-shopping-cart fa-4x text-info"></i>
        </MDBCol>
        <MDBCol col="9">
          <p>Do you need more time to make a purchase decision?</p>
          <p>No pressure, your product will be waiting for you in the cart.</p>
        </MDBCol>
      </MDBRow>
    </MDBModalBody>
    <MDBModalFooter>
      <MDBBtn color="info"> Go to the cart </MDBBtn>
      <MDBBtn color="outline-info" @click="exampleSideModal1 = false">
        Close
      </MDBBtn>
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

const exampleSideModal1 = ref(false);
</script>

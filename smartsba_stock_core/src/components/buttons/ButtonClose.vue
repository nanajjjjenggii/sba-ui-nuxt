<template>
  <MDBBtn id="close-button" color="grey" @click="onClick">
    <slot>Close</slot>
  </MDBBtn>
</template>

<script setup>
import { MDBBtn } from 'mdb-vue-ui-kit';

const onClick = () => {
  window.close();
};
</script>

<style lang="scss" scoped></style>

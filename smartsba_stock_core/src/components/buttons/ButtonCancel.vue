<template>
  <MDBBtn id="cancel-button" color="grey" @click="onClick">
    <slot>Cancel</slot>
  </MDBBtn>
</template>

<script setup>
import { MDBBtn } from 'mdb-vue-ui-kit';

const onClick = () => {
  router.back();
};
</script>

<style lang="scss" scoped></style>

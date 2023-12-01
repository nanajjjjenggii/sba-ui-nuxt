<template>
  <MDBBtn
    color="light"
    class="btn-add d-flex align-items-center fw-bold"
    size="xs"
  >
    <span class="material-icons-round me-1">add</span>
    <slot>Add</slot>
  </MDBBtn>
</template>
<script lang="ts" setup>
import { MDBBtn } from 'mdb-vue-ui-kit';
</script>
<style scoped>
.btn-add {
  /* background-color: #f2f2f2; */
  border: 1px solid #e0e0e0;
}
</style>

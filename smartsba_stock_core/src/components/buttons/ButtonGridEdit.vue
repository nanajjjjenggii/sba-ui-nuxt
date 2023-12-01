<template>
  <MDBBtn class="buttonEdit" :disabled="!props.canedit">
    <slot>EDIT</slot>
  </MDBBtn>
</template>

<script setup lang="ts">
import { MDBBtn } from 'mdb-vue-ui-kit';

interface Props {
  canedit?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  canedit: true,
});
</script>

<style scoped>
.btn:disabled {
  border: 1px solid #999999 !important;
  background-color: #cccccc !important;
  color: #666666 !important;
}

.buttonEdit {
  color: rgb(255, 255, 255);
  background-color: rgb(71, 178, 191);
  min-width: 64px;
}
</style>

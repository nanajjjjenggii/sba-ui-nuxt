<template>
  <MDBBtn class="buttonDelete" :disabled="!props.candelete">
    <slot>DELETE</slot>
  </MDBBtn>
</template>

<script setup lang="ts">
import { MDBBtn } from 'mdb-vue-ui-kit';

interface Props {
  candelete?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  candelete: true,
});
</script>

<style scoped>
.btn:disabled {
  border: 1px solid #999999 !important;
  background-color: #cccccc !important;
  color: #666666 !important;
}

.buttonDelete {
  color: rgb(255, 255, 255);
  background-color: rgb(242, 88, 88);
  min-width: 64px;
}
</style>

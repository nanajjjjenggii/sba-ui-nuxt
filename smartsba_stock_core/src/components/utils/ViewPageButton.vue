<template>
  <div id="view-page-button" class="row gx-0 mb-3 utils-viewpage-btn">
    <div class="d-flex justify-content-between">
      <MDBBtn id="view-back-button" color="dark" @click="router.back()"
        >Back</MDBBtn
      >
      <MDBBtn
        id="view-printslip-button"
        color="primary"
        @click="$emit('print-slip')"
        >Print Slip</MDBBtn
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { MDBBtn } from 'mdb-vue-ui-kit';
const router = useRouter();
defineEmits(['print-slip']);
</script>

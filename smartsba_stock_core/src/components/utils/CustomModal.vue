<template>
  <MDBModal
    v-show="modelValue"
    :id="id"
    v-model="initModal"
    tabindex="-1"
    :labelledby="`${id}Label`"
    :size="size"
    :keyboard="false"
    static-backdrop
    @hide="$emit('hide')"
    @hidden="$emit('hidden')"
    @show="
      isShowBody = true;
      $emit('show');
    "
  >
    <MDBModalHeader :close="false">
      <button
        class="btn-close"
        aria-label="Close"
        @click.prevent="$emit('update:modelValue', false)"
      />
    </MDBModalHeader>
    <MDBModalBody v-if="isShowBody" class="px-4 pt-0">
      <HeaderBoxLabel class="mb-0">
        <slot :id="`${id}Label`" name="title" />
      </HeaderBoxLabel>
      <form @submit.prevent>
        <slot name="body" />
      </form>
    </MDBModalBody>
    <MDBModalFooter class="px-4">
      <slot name="footer" />
    </MDBModalFooter>
  </MDBModal>
</template>

<script lang="ts" setup>
import {
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-vue-ui-kit';

interface ModalProps {
  id: string;
  size?: string;
  modelValue: boolean;
}
withDefaults(defineProps<ModalProps>(), {
  id: 'modal',
  size: '--' /* sm | lg | xl */,
  modelValue: false,
});
defineEmits(['update:modelValue', 'show', 'hide', 'hidden']);
const initModal: Ref<boolean> = ref(true);
const isShowBody = ref(false);
</script>

<style lang="scss" scoped>
.modal-header {
  border-bottom: none;
  padding-bottom: 0;
}
.modal-body > form {
  box-shadow: 0 -2px 0 0 #efefef;
  padding-top: 1rem;
}
.modal-footer {
  border-top: none;
}
</style>

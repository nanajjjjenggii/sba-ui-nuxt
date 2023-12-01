<template>
  <MDBModal
    v-show="$props.modelValue"
    :id="props.id"
    v-model="initModal"
    tabindex="-1"
    :labelledby="`${props.id}Label`"
    :size="size"
    :keyboard="false"
    static-backdrop
    @show="isShowBody = true"
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
      <!-- class="overflow-x-scroll" -->
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
  // visible: boolean;
  modelValue: boolean;
}
const props = withDefaults(defineProps<ModalProps>(), {
  id: 'modal',
  size: '--',
  // visible: false,
  modelValue: false,
});
defineEmits(['update:modelValue']);
const initModal: Ref<boolean> = ref(true);
const isShowBody = ref(false);
</script>

<script lang="ts"></script>

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

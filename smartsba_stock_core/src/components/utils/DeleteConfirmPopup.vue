<template>
  <CustomModal
    id="confirm-popup"
    v-model="visibleModal"
    centered
    @show="handleShowPopup()"
    @hidden="handleHidePopup()"
  >
    <template #title>Delete Request</template>
    <template #body>
      <div
        v-if="hideContent"
        :id="`${id}-body`"
        class="accordion-collapse"
        :aria-labelledby="`${id}-heading`"
        :data-mdb-parent="`#${id}`"
      >
        <FormRow>
          <FormTextarea
            :id="id"
            v-model="reasonValue"
            label="เหตุผลการยกเลิกรายการ / Cancel’s reason"
            :input-name="name"
            :rules="$Yup.string().required().max(200).label('Cancel\'s reason')"
            required
          />
        </FormRow>
      </div>
    </template>
    <template #footer>
      <MDBBtn color="grey" @click="handleCancel"> Cancel </MDBBtn>
      <MDBBtn color="danger" @click="handleConfirm"> CONFIRM </MDBBtn>
    </template>
  </CustomModal>
</template>

<script setup lang="ts">
import { MDBBtn } from 'mdb-vue-ui-kit';

interface DeletePopupProps {
  modelValue: string;
  id?: string;
  name?: string;
  required?: boolean;
}
const props = withDefaults(defineProps<DeletePopupProps>(), {
  id: 'cancelreason',
  name: 'cancelreason',
  required: true,
});
const visibleModal = ref<boolean>(true);
const hideContent = ref<boolean>(false);
const reasonValue = ref<string>(props.modelValue);
const emit = defineEmits([
  'cancel',
  'confirm',
  'update:modelValue',
  'update:showValue',
]);
watch(reasonValue, (value: string) => emit('update:modelValue', value));
watch(visibleModal, (value: boolean) => {
  /* visibleModal = false from CustomModal emit */
  if (!value) handleCancel();
});
const handleCancel = () => {
  visibleModal.value = true;
  reasonValue.value = '';
  emit('cancel');
};
const handleConfirm = () => emit('confirm');
const handleShowPopup = () => (hideContent.value = true);
const handleHidePopup = () => (hideContent.value = false);
</script>

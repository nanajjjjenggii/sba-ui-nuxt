<template>
  <CustomModal
    id="confirm-popup"
    v-model="visibleModal"
    centered
    @show="handleShowPopup()"
    @hidden="handleHidePopup()"
  >
    <template #title> {{ reqHeader }} </template>
    <template #body>
      <FormLabel :required="required">
        {{ reqTitle }}
      </FormLabel>
      <CommentBoxBody
        :id="id"
        v-model="commentValue"
        :name="name"
        :popup="true"
        :class="`w-100`"
        :required="required"
        :usefield="visibleField"
      />
    </template>
    <template #footer>
      <MDBBtn color="grey" @click="handleCancel"> Cancel </MDBBtn>
      <MDBBtn v-if="actiontype === 'J'" color="danger" @click="handleConfirm">
        CONFIRM TO REJECT
      </MDBBtn>
      <MDBBtn
        v-else-if="actiontype === 'R'"
        color="warning"
        @click="handleConfirm"
      >
        CONFIRM TO RETURN
      </MDBBtn>
      <MDBBtn
        v-else-if="actiontype === 'P'"
        color="success"
        @click="handleConfirm"
      >
        CONFIRM TO APPROVE
      </MDBBtn>
    </template>
  </CustomModal>
</template>

<script setup lang="ts">
import { MDBBtn } from 'mdb-vue-ui-kit';

interface ConfirmPopupProps {
  modelValue: string;
  actiontype: string;
  id?: string;
  name?: string;
  required?: boolean;
}
const props = withDefaults(defineProps<ConfirmPopupProps>(), {
  id: 'comment',
  name: 'comment',
  required: false,
});
const reqActiontype = ref<string>(props.actiontype || '');
const reqHeader = ref<string>('');
const reqTitle = ref<string>('');
watchEffect(() => {
  reqActiontype.value = props.actiontype;
  switch (props.actiontype) {
    case 'J':
      reqHeader.value = 'Reject Request';
      reqTitle.value =
        'ระบุเหตุผลในการปฏิเสธใบคำร้อง / Please specify reason for rejection';
      break;
    case 'R':
      reqHeader.value = 'Return Request';
      reqTitle.value =
        'ระบุเหตุผลในการส่งคืนคำใบร้องขอ / Please specify reason for returning';
      break;
    default:
      reqHeader.value = 'Approve Request';
      reqTitle.value =
        'ระบุเหตุผลในการอนุมัติ / Please specify reason for approval';
  }
});
const visibleModal = ref<boolean>(true);
const visibleField = ref<boolean>(false);
const commentValue = ref<string>(props.modelValue);
const commentfield = useForm<{ [commentname: string]: string }>();
const emit = defineEmits([
  'cancel',
  'confirm',
  'update:modelValue',
  'update:showValue',
]);
watch(commentValue, (value: string) => emit('update:modelValue', value));
watch(visibleModal, (value: boolean) => {
  if (!value) handleCancel();
});
const handleCancel = () => {
  visibleModal.value = true;
  commentValue.value = '';
  reqActiontype.value = '';
  emit('cancel');
};
const handleConfirm = async () => {
  if (props.required) {
    const validate = await commentfield.validateField(props.name);
    if (!validate.valid) return false;
  }
  emit('confirm');
};
const handleShowPopup = () => (visibleField.value = true);
const handleHidePopup = () => (visibleField.value = false);
</script>

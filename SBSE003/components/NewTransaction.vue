<template>
  <ModalCenter
    id="newtransdetail_model"
    v-model="showModal"
    size="lg"
    @hide="emit('update:modelValue', showModal)"
    @hidden="resetFormFunction()"
  >
    <template #title> รายละเอียดการทำรายการ / Transaction's Detail </template>
    <template #body>
      <FormDiv @submit="saveNewTransaction">
        <EditTransactionDetails
          v-model="transaction"
          :avg-price-params="avgpriceParams"
          modal-mode
        />
        <div class="d-flex justify-content-end">
          <MDBBtn color="grey" @click="resetFormFunction()">CLOSE</MDBBtn>
          <MDBBtn color="warning" type="submit">SAVE</MDBBtn>
        </div>
      </FormDiv>
    </template>
  </ModalCenter>
</template>

<script lang="ts" setup>
import { MDBBtn } from 'mdb-vue-ui-kit';
import { useForm } from 'vee-validate';
import { EditTransDetailTypes, GridFormTypes } from '../ts/sbse003_types';
import sbse003 from '../ts/sbse003';
// import EditTransactionDetails from './EditTransactionDetails.vue';
const EditTransactionDetails = defineAsyncComponent(
  () => import('./EditTransactionDetails.vue'),
);

const prop = defineProps<{
  modelValue: boolean;
  faccountData: {
    custtype: string;
    custacct: string;
    custcode: string;
  };
}>();

const formControl = useForm<EditTransDetailTypes>();
const transaction = inject<GridFormTypes>('transdetail') as GridFormTypes;
const avgpriceParams = reactive({
  custtype: prop.faccountData.custtype,
  custacct: prop.faccountData.custacct,
  custcode: prop.faccountData.custcode,
});
const showModal = ref<boolean>(prop.modelValue);
const objectiveValue = ref('');
const remarkValue = ref('');

const emit = defineEmits<{
  (e: 'update:modelValue', flag: boolean): void;
  (e: 'add:transaction', dataItem: GridFormTypes): void;
}>();

watch(
  () => prop.modelValue,
  () => {
    showModal.value = prop.modelValue;
    console.log('# 👁️ prop.modelValue: ', prop.modelValue);
    if (showModal.value) {
      console.log('# objective: ', transaction.objective);
      console.log('# remark: ', transaction.remark);
      objectiveValue.value = transaction.objective;
      remarkValue.value = transaction.remark;
    }
  },
);
const saveNewTransaction = async () => {
  console.log('# saveNewTransaction !! ');
  const validate = await formControl.validate();
  if (validate.valid) {
    const values = await formControl.values;
    console.log('# transaction: ', JSON.stringify(transaction));
    // console.log('# values: ', JSON.stringify(values));
    const dataItem = {
      ...transaction,
      // ...values,
      transunit: values.unit,
    };
    // const dataItem = { ...transaction?._value, transunit: values.unit };
    console.log('# dataItem: ', JSON.stringify(dataItem));
    emit('add:transaction', dataItem);
    showModal.value = false;
  }
};

const resetFormFunction = () => {
  console.log('# resetFormFunction');
  formControl.resetForm({
    values: {
      ...sbse003.DefaultTransdetail,
      objective: objectiveValue.value,
      remark: remarkValue.value,
    },
  });
  showModal.value = false;
};
</script>

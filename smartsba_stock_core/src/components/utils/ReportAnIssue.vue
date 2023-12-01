<template>
  <ModalCenter
    id="report-issue-modal-center"
    v-model="showModal"
    @hide="emit('update:modelValue', showModal)"
  >
    <template #title> REPORT AN ISSUE </template>
    <template #body>
      <FormInput
        id="describe_issue"
        v-model="form.description"
        name="describe_issue"
        type="textarea"
        rows="6"
        placeholder="Describe the issue in details..."
        no-label
      >
      </FormInput>
      <div class="d-flex flex-row mt-3">
        <div class="col-3">Program ID</div>
        <div class="col-9">{{ pId }}</div>
      </div>
      <div class="d-flex flex-row mt-3">
        <div class="col-3">Program Name</div>
        <div class="col-9">{{ pName }}</div>
      </div>
      <div class="d-flex flex-row mt-3">
        <div class="col-3 d-flex align-items-center">Email Address</div>
        <FormInput id="email" v-model="form.email" class="col-9"></FormInput>
      </div>
      <div class="d-flex flex-row mt-3">
        <div class="col-3 d-flex align-items-center">Attatch File</div>
        <div class="col-9 d-flex align-items-center">
          <!-- <MDBBtn class="button-bg-color-green text-capitalize me-2"
            >Choose File</MDBBtn
          > -->
          <input type="file" @change="onChooseFile" />
        </div>
      </div>
      <div class="d-flex flex-row mt-3">
        <div class="col-3 d-flex align-items-center"></div>
        <div class="col-9">
          File may be sent to Freewill Solutions for solving the problem.
        </div>
      </div>
      <FormCheckbox
        id="uselogs_flag"
        v-model="form.uselogs"
        input-name="uselogs_flag"
        input-label="Send Logs and system information"
        no-label
      ></FormCheckbox>
      <FormCheckbox
        id="usescreen_flag"
        v-model="form.usescreenshot"
        input-name="usescreen_flag"
        input-label="Include this screenshot"
        no-label
      ></FormCheckbox>
      <div class="img col-sm-6">
        <img :src="img" width="150" />
      </div>
    </template>
    <template #footer>
      <MDBBtn color="grey" @click="showModal = false">CANCEL</MDBBtn>
      <MDBBtn class="button-bg-color-green" @click="onClickSave">SAVE</MDBBtn>
    </template>
  </ModalCenter>
</template>

<script lang="ts" setup>
import { MDBBtn } from 'mdb-vue-ui-kit';
import * as pico from '@gripeless/pico';

const props = defineProps<{
  modelValue: boolean;
  faccountData: {
    reftype: string;
    actionMode: string;
  };
}>();
const showModal = ref<boolean>(props.modelValue);
const form = reactive({
  description: '',
  email: '',
  uselogs: true,
  usescreenshot: false,
});
const pId = ref('');
const pName = ref('');
const file = ref();
const img = ref('');

watch(
  () => props.modelValue,
  () => {
    console.log('props visible changed', props.modelValue);
    showModal.value = props.modelValue;
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

onMounted(() => {
  handleProgramData();
  const ss = pico.dataURL(window, { ignore: ['.report'] });
  ss.then((result: any) => {
    img.value = result.value;
  });
});

function handleProgramData() {
  switch (props.faccountData.reftype) {
    case 'BC':
      pId.value = 'SBSE07F';
      break;
    case 'DE':
      pId.value = 'SBSE001';
      break;
    case 'GC':
      pId.value = 'SBSE007';
      break;
    case 'TC':
      pId.value = 'SBSE003';
      break;
    case 'TI':
      pId.value = 'SBSE005';
      break;
    case 'TO':
      pId.value = 'SBSE006';
      break;
    case 'WD':
      pId.value = 'SBSE002';
      break;
  }
  pName.value =
    pId.value +
    '\n' +
    props.faccountData.actionMode.charAt(0).toUpperCase() +
    props.faccountData.actionMode.slice(1);
}

function onChooseFile(event: any) {
  console.log('# File : ', event.target.value);
  file.value = event.target.value;
}

function onClickSave() {
  console.log('# Click Save!!');
}
</script>

<style lang="scss" scoped>
.button-bg-color-green {
  background-color: rgb(26, 187, 156);
  color: rgb(255, 255, 255);
}

input[type='file']::file-selector-button {
  border: 2px solid rgb(26, 187, 156);
  padding: 4px 8px;
  margin-right: 8px;
  border-radius: 4px;
  background-color: rgb(26, 187, 156);
  color: rgb(255, 255, 255);
  cursor: pointer;
}

.img {
  position: absolute;
  text-align: right;
  right: 20px;
  bottom: 5px;
}
</style>

<template>
  <FormGroup :class="className">
    <FormLabel
      :for="`${id}`"
      :class="`${required ? 'require' : ''}`"
      :required="required"
      style="display: flex"
    >
      <span>{{ label }}</span>
      <Tooltip v-if="tooltip" :position="'top'" :anchor-element="'target'">
        <span
          class="material-icons-outlined ms-1"
          style="font-size: 18px"
          :title="tooltip"
        >
          help
        </span>
      </Tooltip>
    </FormLabel>
    <div :class="`${lockClick ? 'lock-click' : ''}`">
      <MDBBtnGroup>
        <MDBRadio
          v-model="tsdconfirm"
          :btn-check="true"
          :wrap="false"
          :label-class="`btn btn-default btn-on-1 btn-sm ${
            yesTSDConfirm ? 'active' : ''
          }`"
          label="YES"
          name="confirm"
          value="1"
          @click="onClickYes"
        />
        <MDBRadio
          v-model="tsdconfirm"
          :btn-check="true"
          :wrap="false"
          :label-class="`btn btn-default btn-off-1 btn-sm ${
            noTSDConfirm ? 'active' : ''
          }`"
          label="NO"
          name="confirm"
          value="0"
          @click="onClickNo"
        />
      </MDBBtnGroup>
    </div>
  </FormGroup>
</template>

<script setup lang="ts">
import { MDBRadio, MDBBtnGroup } from 'mdb-vue-ui-kit';
import { Tooltip } from '@progress/kendo-vue-tooltip';

interface SwitchRadio {
  id?: string;
  label: string;
  modelValue: string;
  className?: string;
  required?: boolean;
  lockClick?: boolean;
  tooltip?: string;
}

const props = withDefaults(defineProps<SwitchRadio>(), {
  id: 'switchredio',
  className: '',
  required: false,
  lockClick: false,
  tooltip: '',
});

const emit = defineEmits<{
  (e: 'update:modelValue', name: null | string): void;
}>();

const tsdconfirm = ref(props.modelValue);
const yesTSDConfirm = ref(true);
const noTSDConfirm = ref(false);

onMounted(() => {
  if (tsdconfirm.value === '1') {
    onClickYes();
  } else if (tsdconfirm.value === '0') {
    onClickNo();
  }
});

watch(props, () => {
  if (props.modelValue === '1') {
    yesTSDConfirm.value = true;
    noTSDConfirm.value = false;
  } else {
    yesTSDConfirm.value = false;
    noTSDConfirm.value = true;
  }
});

const onClickYes = () => {
  yesTSDConfirm.value = true;
  noTSDConfirm.value = false;
  tsdconfirm.value = '1';
  emit('update:modelValue', tsdconfirm.value);
};
const onClickNo = () => {
  yesTSDConfirm.value = false;
  noTSDConfirm.value = true;
  tsdconfirm.value = '0';
  emit('update:modelValue', tsdconfirm.value);
};

watch(
  () => props.modelValue,
  (value: string) => {
    if (value) {
      tsdconfirm.value = value as string;
    }
  },
);
</script>

<style>
.lock-click {
  pointer-events: none;
}
.btn-default {
  color: #fff;
  background-color: #b3b3b3 !important;
}
.btn-default.btn-on-1.btn-sm.active {
  background-color: #00994d !important;
  color: #fff;
}
.btn-default.btn-off-1.btn-sm.active {
  background-color: #d24b45 !important;
  color: #fff;
}
.btn-default.btn-off-1.btn-sm:hover,
.btn-default.btn-on-1.btn-sm:hover {
  color: #fff;
}
</style>

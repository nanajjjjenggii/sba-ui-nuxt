<template>
  <div :class="`p-0 d-flex flex-column ${props.className}`">
    <div class="fs-6">
      <label class="form-label"
        ><slot name="title">DateRangePicker</slot></label
      >
    </div>
    <div class="d-flex align-items-end position-relative">
      <div
        :style="{ left: props.left, height: '30px', fontSize: '14px' }"
        class="position-absolute px-2 py-1"
      >
        to
      </div>
      <div>
        <DateRangePicker
          :value="xDate"
          :format="props.format"
          :valid="props.defaultShow"
          @change="onChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '@progress/kendo-intl';
import { DateRangePicker } from '@progress/kendo-vue-dateinputs';

interface Props {
  className: string;
  modelValue: any;
  defaultShow: boolean;
  format: string;
  left: string;
}

const props = withDefaults(defineProps<Props>(), {
  className: 'col-md-4',
  modelValue: { fromDate: '', toDate: '' },
  defaultShow: false,
  format: 'dd/MM/yyyy',
  left: '46%',
});

const xDate = ref({
  start: new Date(),
  end: new Date(),
});

setFromToDate();
watch(props, () => {
  setFromToDate();
});

const emit = defineEmits<{
  (e: 'update:modelValue', objectDate: object): void;
}>();

function setFromToDate() {
  if (props.modelValue.fromDate !== '' && props.modelValue.toDate !== '') {
    xDate.value = {
      start: new Date(
        `${props.modelValue.fromDate.split('/')[2]}, ${
          props.modelValue.fromDate.split('/')[1]
        }, ${props.modelValue.fromDate.split('/')[0]}`,
      ),
      end: new Date(
        `${props.modelValue.toDate.split('/')[2]}, ${
          props.modelValue.toDate.split('/')[1]
        }, ${props.modelValue.toDate.split('/')[0]}`,
      ),
    };
  }
}

function onChange(e: any) {
  xDate.value = { start: e.value.start, end: e.value.end };
  const fromDate = formatDate(xDate.value.start, 'dd/MM/yyyy');
  const toDate = formatDate(xDate.value.end, 'dd/MM/yyyy');
  const objectDate = ref({ fromDate, toDate });
  emit('update:modelValue', objectDate.value);
}
</script>

<style>
.k-floating-label-container > .k-label {
  display: none;
}

.k-floating-label-container {
  padding-top: 5px;
}

.k-daterangepicker {
  gap: 25px;
}
</style>

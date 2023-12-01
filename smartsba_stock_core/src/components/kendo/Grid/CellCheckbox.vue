<template>
  <td v-if="renderCell" :class="className">
    <span v-if="field === 'selected'" class="text-center">
      <FormCheckbox
        v-if="visible"
        :id="inputId"
        v-model="selectedRow"
        :box-class="`d-flex justify-content-center`"
        :input-wrapper-class="`m-auto`"
        :input-name="inputId"
        :form-check="false"
        inline
        nolabel
        @change="handleOnChange"
      />
    </span>
  </td>
</template>
<script lang="ts" setup>
import { guid } from '@progress/kendo-vue-common';

const props = defineProps<{
  isSelected: boolean;
  field: string;
  dataItem: object;
  className: string;
  columnIndex: number;
  columnsCount: number;
  rowType: string;
  level: number;
  visible: boolean;
}>();

const emits = defineEmits(['selectionchange']);
const renderCell = computed((): boolean => {
  return props.field !== undefined && props.rowType !== 'groupHeader';
});
const selectedRow = ref<boolean>(props.isSelected);
const inputId = ref<string>('');

onMounted(() => {
  inputId.value = guid();
});

const handleOnChange = (event: any) => {
  emits('selectionchange', {
    event,
    dataItem: props.dataItem,
  });
};

watch(
  () => props.isSelected,
  (value: boolean) => {
    selectedRow.value = value;
  },
);
</script>
<!-- <style lang="scss" scoped>
$checkbox-size: 20px;
.text-center {
  :deep(.form-checkbox-box .form-check-input[type='checkbox']) {
    height: $checkbox-size;
    width: $checkbox-size;
  }
}
</style> -->

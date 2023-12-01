<template>
  <div>
    <FormLabel
      :for="props.id"
      :no-label="props.noLabel"
      :class-name="props.labelClass"
      :required="props.required"
    >
      {{ props.label }}
    </FormLabel>
    <VeeField
      :id="props.id"
      v-model="inputText"
      :name="props.inputName"
      type="hidden"
      :rules="autoRules"
    />
    <KendoNumericTextBox
      :id="props.id"
      :value="inputValue"
      :name="props.inputName"
      :placeholder="props.placeholder"
      :class="`form-control ${inputClassDefault}`"
      :input-class="props.readonly ? 'input-readonly' : ''"
      :disabled="props.disabled"
      :readonly="props.readonly"
      :tab-index="props.disabled || props.readonly ? -1 : 0"
      :required="required"
      :valid="isValid"
      :fill-mode="fillMode"
      :dir="dir"
      :spinners="spinners"
      :format="format"
      @blur="$emit('blur')"
      @change="onChange"
    />
    <InputErrorMsg v-if="!isValid" :for="props.id">
      {{ errorMessage }}
    </InputErrorMsg>
  </div>
</template>
<script lang="ts" setup>
import * as Yup from 'yup';
import { NumericTextBox as KendoNumericTextBox } from '@progress/kendo-vue-inputs';

interface FormNumeric {
  id: string;
  label?: string;
  labelClass?: string;
  noLabel?: boolean;
  inputClass?: string;
  inputName?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  modelValue: string;
  spinners?: boolean;
  format?: string;
  dir?: string;
  rules?: Yup.NumberSchema;
}

const props = withDefaults(defineProps<FormNumeric>(), {
  label: '',
  labelClass: '',
  noLabel: false,
  inputClass: '',
  inputName: '',
  placeholder: '',
  required: false,
  disabled: false,
  readonly: false,
  spinners: false,
  format: '',
  dir: 'rtl',
  rules: undefined,
});

defineEmits<{
  (e: 'update:modelValue', value: null | string): void;
  (e: 'blur', value: number): void;
  // (e: 'input', value: number): void;
}>();

const rulesLabel = props.rules?.spec?.label || 'This field';
const autoRules = computed(() => {
  return inputText.value === ''
    ? props.required
      ? Yup.string().label(rulesLabel).required()
      : Yup.string()
    : props.rules;
});
const inputValue = ref<number | null>(
  props.modelValue ? parseFloat(props.modelValue) : null,
);
const inputText = ref<string | null>();
const inputClassDefault = props.readonly
  ? props.inputClass + 'line-readonly form-control-plaintext'
  : props.inputClass;
const fillMode = props.readonly ? null : 'solid';

const fieldSchema = useField(toRef(props, 'inputName'), props.rules, {
  initialValue: inputValue.value,
});
const { errorMessage, meta } = fieldSchema;
const isValid = computed((): boolean => {
  return meta.validated ? errorMessage.value === undefined && meta.valid : true;
});

watch(
  () => props.modelValue,
  (value: string) => {
    // console.log('# 👁️ props.modelValue: ', value);
    inputValue.value = value ? parseFloat(value) : null;
  },
);

const onChange = (event: any) => {
  // console.log('# onChange: ', event);
  const value: number | null = event.value;
  inputText.value = value !== null ? String(value) : null;
};
</script>

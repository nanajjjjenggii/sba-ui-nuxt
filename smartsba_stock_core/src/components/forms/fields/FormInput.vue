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
    />
    <KendoInput
      :id="props.id"
      v-model="inputText"
      type="text"
      :name="props.inputName"
      :placeholder="props.placeholder"
      :class="`form-control ${inputClassDefault}`"
      :input-class="props.readonly ? 'input-readonly' : ''"
      :disabled="props.disabled"
      :readonly="props.readonly"
      :tab-index="props.readonly ? -1 : 0"
      :fill-mode="fillMode"
      :required="required"
      :valid="isValid"
      @blur="$emit('blur')"
      @input="$emit('input')"
    />
    <InputErrorMsg v-if="!isValid" :for="props.id">
      {{ errorMessage }}
    </InputErrorMsg>
  </div>
</template>

<script lang="ts" setup>
import * as Yup from 'yup';
import { Input as KendoInput } from '@progress/kendo-vue-inputs';

interface FormInput {
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
  modelValue?: string;
  rules?: Yup.StringSchema;
}

const props = withDefaults(defineProps<FormInput>(), {
  label: '',
  labelClass: '',
  noLabel: false,
  inputClass: '',
  inputName: '',
  inputValue: '',
  placeholder: '',
  required: false,
  disabled: false,
  readonly: false,
  modelValue: '',
  rules: undefined,
});

defineEmits<{
  (e: 'update:modelValue', value: null | string): void;
  (e: 'blur', value: string): void;
  (e: 'input', value: string): void;
}>();

const inputText = ref(props.modelValue);
const inputClassDefault = props.readonly
  ? props.inputClass + 'line-readonly form-control-plaintext'
  : props.inputClass;
const fillMode = props.readonly ? null : 'solid';

const fieldSchema = useField(toRef(props, 'inputName'), props.rules, {
  initialValue: props.modelValue || '',
});
const { errorMessage, meta } = fieldSchema;
const isValid = computed((): boolean => {
  return meta.validated ? errorMessage.value === undefined && meta.valid : true;
});

watch(
  () => props.modelValue,
  (value: string) => {
    inputText.value = value as string;
  },
);
</script>

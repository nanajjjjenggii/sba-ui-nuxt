<template>
  <FormLabel
    :for="props.id"
    :no-label="props.noLabel"
    :class-name="props.labelClass"
    :required="props.required"
  >
    {{ props.label }}
  </FormLabel>
  <div class="form-radio-box">
    <MDBRadio
      v-for="option in radioOptionList"
      :id="`${props.id}_${option.value}`"
      :key="option.value"
      v-model="radiochecked"
      :name="`${props.inputName}_${option.value}`"
      :class="`${props.inputClass}`"
      :wrapper-class="props.readonly ? 'radio-checkbox-readonly' : ''"
      :required="props.required"
      :disabled="props.disabled"
      :readonly="props.readonly"
      :value="option.value"
      :label="option.label"
      :inline="inline"
    />
  </div>
</template>

<script lang="ts" setup>
import { MDBRadio } from 'mdb-vue-ui-kit';

export interface RadioOptions {
  value: string;
  label: string;
}

interface FormRadio {
  id: string;
  label?: string;
  labelClass?: string;
  noLabel?: boolean;
  inputClass?: string;
  inputName?: string;
  className?: string;
  disabled?: boolean;
  readonly?: boolean;
  modelValue?: string;
  inline?: boolean;
  required?: boolean;
  radioOptionList: RadioOptions[];
}

const props = withDefaults(defineProps<FormRadio>(), {
  label: '',
  labelClass: '',
  noLabel: false,
  inputClass: '',
  inputName: '',
  className: '',
  disabled: false,
  readonly: false,
  modelValue: '',
  inline: false,
  required: false,
  radioOptionList: () => [],
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'update:value', value: string): void;
  (e: 'blur', value: string): void;
}>();

const radiochecked = ref<string>((props.modelValue as string) || '');
watch(radiochecked, (value: string) => {
  emit('update:modelValue', value);
});

watch(
  () => props.modelValue,
  (value: string) => {
    if (value) {
      radiochecked.value = value as string;
    }
  },
);
</script>

<style lang="scss" scoped>
$input-bg: #31bb9c;
.form-radio-box {
  min-height: 30px;
  :deep(.form-check-input[type='radio']) {
    &:checked {
      border-color: $input-bg;
      &:focus::before {
        box-shadow: 0px 0px 0px 13px var(--theme-default-active);
      }
      &::after {
        border-color: $input-bg;
        background-color: $input-bg;
      }
    }
  }
}
</style>

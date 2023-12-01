<template>
  <div
    class="form-checkbox-box"
    :class="{
      [boxClass]: boxClass,
    }"
  >
    <FormLabel
      :for="props.id"
      :no-label="props.noLabel"
      :class-name="props.labelClass"
      :required="props.required"
    >
      {{ props.label }}
    </FormLabel>
    <MDBCheckbox
      :id="props.id"
      v-model="checked"
      :label="props.inputLabel"
      :label-class="props.inputLabelClass"
      :input-class="props.inputClass"
      :name="props.inputName"
      :tag="props.inputWrapperTag"
      :wrapper-class="newWrapperClass"
      :form-check="props.formCheck"
      :btn-check="props.btnCheck"
      :wrap="props.wrap"
      :inline="props.inline"
      :disabled="props.disabled"
      :readonly="props.readonly"
      :required="props.required"
    />
  </div>
</template>

<script lang="ts" setup>
import { MDBCheckbox } from 'mdb-vue-ui-kit';

interface FormCheckbox {
  /* Custom Attributes */
  modelValue?: boolean;
  id: string;
  boxClass?: string;
  label?: string;
  labelClass?: string;
  noLabel?: boolean;
  /* Fields */
  inputName?: string;
  inputClass?: string /* Ref. official MDB */;
  inputLabel?: string /* Ref. official MDB: label */;
  inputLabelClass?: string /* Ref. official MDB: labelClass */;
  inputWrapperTag?: string /* Ref. official MDB: tag */;
  inputWrapperClass?: string /* Ref. official MDB: wrapperClass */;
  inline?: boolean /* Ref. official MDB */;
  btnCheck?: boolean /* Ref. official MDB */;
  wrap?: boolean /* Ref. official MDB */;
  formCheck?: boolean /* Ref. official MDB */;
  required?: boolean /* Ref. official MDB */;
  readonly?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<FormCheckbox>(), {
  modelValue: false,
  boxClass: '',
  label: '',
  labelClass: '',
  noLabel: false,
  /* Fields */
  inputName: '',
  inputClass: '',
  inputLabel: '',
  inputLabelClass: '',
  inputWrapperTag: 'div',
  inputWrapperClass: '',
  inline: false,
  btnCheck: false,
  wrap: true,
  formCheck: true,
  required: false,
  readonly: false,
  disabled: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'update:value', value: string): void;
  (e: 'blur', value: string): void;
}>();

const newWrapperClass =
  props.inputWrapperClass + (props.readonly ? 'radio-checkbox-readonly' : '');
const checked = ref<boolean>((props.modelValue as boolean) || false);
watch(checked, (value: boolean) => {
  emit('update:modelValue', value);
});

watch(
  () => props.modelValue,
  (value: boolean) => {
    checked.value = value as boolean;
  },
);
</script>

<style lang="scss" scoped>
$input-bg: #31bb9c;
.form-checkbox-box {
  :deep(.form-check-input[type='checkbox']) {
    &:checked {
      border-color: $input-bg;
      background-color: $input-bg;
      &:focus::before {
        box-shadow: 0px 0px 0px 13px var(--theme-default-active);
      }
    }
  }
}
</style>

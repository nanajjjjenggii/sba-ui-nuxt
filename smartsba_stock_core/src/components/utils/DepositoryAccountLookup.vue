<template>
  <FormLabel :for="props.id" required> Depository Account </FormLabel>
  <VeeField :id="props.id" v-model="depAcct" :name="props.name" type="hidden" />
  <KendoComboBox
    :id="props.id"
    :name="props.name"
    :placeholder="'Depository Account'"
    :data-items="props.lookupDepacct"
    :text-field="'sdcsubmember'"
    :value-field="'sdcsubmember'"
    :value-primitive="true"
    :value="depAcct"
    :valid="isValid"
    @change="onDepAccChange"
  />
  <InputErrorMsg v-if="!isValid" :for="props.id">
    {{ errorMessage }}
  </InputErrorMsg>
</template>

<script setup lang="ts">
import * as Yup from 'yup';
import { ComboBox as KendoComboBox } from '@progress/kendo-vue-dropdowns';

export interface DepacctLookup {
  brokerno: string;
  shortname: string;
  sdcsubmember: string;
}

interface AccountDetailProps {
  id: string;
  name: string;
  modelValue: string;
  lookupDepacct: DepacctLookup[];
  rules?: Yup.StringSchema;
}

const props = withDefaults(defineProps<AccountDetailProps>(), {
  rules: undefined,
});
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const depAcct = ref<string>('');

const fieldSchema = useField(toRef(props, 'name'), props.rules, {
  initialValue: depAcct.value || '',
});
const { errorMessage, meta } = fieldSchema;
const isValid = computed((): boolean => {
  return !!(errorMessage && meta.valid);
});

const onDepAccChange = (event: any) => {
  depAcct.value = event.target.value;
  emit('update:modelValue', depAcct.value);
};

watch(
  () => props.modelValue,
  (value: string) => {
    depAcct.value = value;
    fieldSchema.setValue(depAcct.value);
  },
);
</script>

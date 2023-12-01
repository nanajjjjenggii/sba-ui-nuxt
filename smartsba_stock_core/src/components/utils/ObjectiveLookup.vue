<template>
  <FormGroup
    :id="`${id}-lookup-box`"
    class="utils-objective-lookup form-group"
    :class="{
      [className]: className,
      'has-error': !!errorMessage,
    }"
  >
    <FormLabel :for="id" :required="required">
      วัตถุประสงค์ / Objective
    </FormLabel>
    <KendoComboBox
      v-if="!isInitial"
      :placeholder="`Choose...`"
      :disabled="isLoading"
      :loading="isLoading"
      :default-value="modelValue"
    />
    <KendoComboBox
      v-else
      :id="`${id}`"
      v-model="inputValue"
      :value="objectiveValue"
      :name="name"
      :enabled="isLoading"
      :loading="isLoading"
      :placeholder="`Choose...`"
      :data-items="items"
      :text-field="'name'"
      :value-field="'name'"
      :value-primitive="true"
      :required="required"
      :allow-custom="true"
      :aria-labelled-by="`${id}-label`"
      :valid="isValid"
      :filterable="true"
      :rules="rules"
      @filterchange="onFilterchange"
      @change="onChange"
      @blur="onBlur"
    />
    <InputErrorMsg v-if="!isValid" :for="id">
      {{ errorMessage }}
    </InputErrorMsg>
  </FormGroup>
</template>

<script setup lang="ts">
import * as Yup from 'yup';
import { filterBy, FilterDescriptor } from '@progress/kendo-data-query';
import { ComboBox as KendoComboBox } from '@progress/kendo-vue-dropdowns';
import { inqSBConfig } from '~/utils/api-util';
type APIData = {
  section?: string;
  type?: string;
  name?: string;
};

interface ObjectiveLookup {
  id: string;
  name: string;
  modelValue: string;
  className?: string;
  required?: boolean;
  valid?: boolean;
  errorMsg?: string;
  params?: APIData;
  placeholder?: string;

  /* vee-validate */
  rules?: Yup.StringSchema;
}

const props = withDefaults(defineProps<ObjectiveLookup>(), {
  className: '',
  required: false,
  errorMsg: '',
  params: () => {
    return {
      section: 'BSE602AObjective',
      type: 'L',
      name: '',
    };
  },
  placeholder: 'select...',

  /* vee-validation */
  rules: undefined,
});

const fieldSchema = useField<string>(toRef(props, 'name'), props.rules);
const { value: inputValue, setErrors, errorMessage, handleBlur } = fieldSchema;

const isLoading: Ref<boolean> = ref(true);
const isInitial: Ref<boolean> = ref(false);
const objectiveList: Ref<Array<never | object>> = ref([]);
const objectiveValue: Ref<string | object> = ref({
  name: props.modelValue || '',
});
const isValid = computed((): boolean => {
  // return meta.touched ? !!errorMessage && meta.valid : true;
  return errorMessage.value === undefined;
});
const items: Ref<Array<never | object>> = ref([]);
const getObjectiveLookup = async (): Promise<Array<never | object>> => {
  try {
    const data: APIData = {
      section: props.params.section,
      type: props.params.type,
      name: props.params.name,
    };

    const response: { [key: string]: any } = await inqSBConfig(data);
    console.log('# InqSBConfig | Objective Response: ', response);

    let lists: Array<object> = [];
    if (response) {
      if (response.result === 'Y' || response.resultcode === '1002') {
        lists = response.lists;
      }
    }
    return lists;
  } catch (error: any) {
    console.error(error);
    setErrors(error);
    throw new Error(error);
  }
};

const emit = defineEmits<(e: 'update:modelValue', name: string) => void>();

const onFilterchange = (event: any) => {
  items.value = filterData(event.filter);
};

const filterData = (filter: FilterDescriptor) => {
  return filterBy(objectiveList.value.slice(), filter);
};

const onChange = (dataitem: any): void => {
  console.log('# onChange', dataitem);
  console.log(
    '# dataItem: ',
    dataitem.value ?? (dataitem.event.target.value || ''),
  );
  emit(
    'update:modelValue',
    dataitem.value ?? (dataitem.event.target.value || ''),
  );
};
const onBlur = (event: any) => {
  onChange(event);
  handleBlur(event);
};
onBeforeMount(async (): Promise<void> => {
  try {
    console.log('# onBeforeMount | objectLookup!');
    objectiveList.value = await getObjectiveLookup();
    if (objectiveList.value.length > 0) items.value = objectiveList.value;
  } catch (err) {
    console.log('👹Found Error!!');
    console.error('# err: ', err);
  } finally {
    console.log('# Finally done🔥');
    isLoading.value = false;
    isInitial.value = true;
  }
});

watch(
  () => props.modelValue,
  (value: string) => {
    objectiveValue.value = value ? { name: value } : '';
  },
);
</script>

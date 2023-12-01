<template>
  <FormGroup
    :id="`${id}-lookup-box`"
    class="utils-remarks-lookup form-group"
    :class="{
      [className]: className,
      'has-error': !!errorMessage,
    }"
  >
    <FormLabel :for="id" :required="required"> หมายเหตุ / Remarks </FormLabel>
    <KendoComboBox
      v-if="isLoading"
      :placeholder="`Choose...`"
      :disabled="isLoading"
      :loading="isLoading"
      :default-value="modelValue"
    />
    <KendoComboBox
      v-else
      :id="id"
      v-model="inputValue"
      :value="remarksValue"
      :name="name"
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
      @filterchange="onFilterchange"
      @change="onChange"
      @blur="onBlur"
    />
    <InputErrorMsg v-show="!isValid" :for="id">
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

interface RemarksLookup {
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

const props = withDefaults(defineProps<RemarksLookup>(), {
  className: '',
  required: false,
  errorMsg: '',
  params: () => {
    return {
      section: 'BSE003ARemark',
      name: '',
      type: 'L',
    };
  },
  placeholder: 'select...',

  /* vee-validation */
  rules: undefined,
});
const nameschema = toRef(props, 'name');

const {
  value: inputValue,
  errorMessage,
  handleBlur,
} = useField<string>(nameschema, props.rules, {
  initialValue: props.modelValue || '',
});

const isLoading: Ref<boolean> = ref(true);
const remarksList: Ref<Array<never | object>> = ref([]);
const remarksValue: Ref<string | object> = ref({
  name: props.modelValue || '',
});
const isValid = computed((): boolean => {
  // return meta.touched ? !!errorMessage && meta.valid : true;
  return errorMessage.value === undefined;
});
const items: Ref<Array<never | object>> = ref([]);
const getRemarksLookup = async (): Promise<Array<never | object>> => {
  try {
    const data: APIData = {
      section: props.params.section,
      type: props.params.type,
      name: props.params.name,
    };

    const response: { [key: string]: any } = await inqSBConfig(data);
    console.log('# InqSBConfig | Remarks Response: ', response);

    let lists: Array<object> = [];
    if (response) {
      if (response.result === 'Y' || response.resultcode === '1002') {
        lists = response.lists;
      }
    }
    return lists;
  } catch (error: any) {
    errorMessage.value = String(error);
    console.error(error);
    // isValid.value = false;
    // errorMessage.value = String(error);
    throw new Error(error);
  }
};

const emit = defineEmits<(e: 'update:modelValue', name: string) => void>();

const onFilterchange = (event: any) => {
  items.value = filterData(event.filter);
};

const filterData = (filter: FilterDescriptor) => {
  return filterBy(remarksList.value.slice(), filter);
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
  handleBlur(event);
  onChange(event);
};
onBeforeMount(async (): Promise<void> => {
  try {
    console.log('# onBeforeMount | objectLookup!');
    remarksList.value = await getRemarksLookup();
    if (remarksList.value.length > 0) items.value = remarksList.value;
  } catch (err) {
    console.log('👹Found Error!!');
    console.error('# err: ', err);
  } finally {
    console.log('# Finally done🔥');
    isLoading.value = false;
  }
});

watch(
  () => props.modelValue,
  (value: string) => {
    remarksValue.value = value ? { name: value } : '';
  },
);
</script>

<template>
  <FormGroup
    :id="`${props.id}-lookup-box`"
    class="form-group"
    :class="[props.className]"
  >
    <FormLabel :for="props.id" :required="props.required">
      {{ props.label }}
    </FormLabel>
    <VeeField
      :id="props.id"
      v-model="purposecode"
      :name="props.name"
      type="hidden"
    />
    <KendoComboBox
      :id="props.id"
      :name="props.name"
      :enabled="!isLoading"
      :loading="isLoading"
      :placeholder="'Choose one of following'"
      :data-items="items"
      :model-value="purposeObject"
      :default-value="purposeObject"
      :text-field="'purposetext'"
      :value-field="'purposecode'"
      :valid="isValid"
      :filterable="true"
      @filterchange="onFilterchange"
      @change="onChange"
    />
    <InputErrorMsg v-if="!isValid" :for="props.id">
      {{ errorMessage }}
    </InputErrorMsg>
  </FormGroup>
</template>

<script setup lang="ts">
import * as Yup from 'yup';
import { ComboBox as KendoComboBox } from '@progress/kendo-vue-dropdowns';
import { filterBy, FilterDescriptor } from '@progress/kendo-data-query';

export interface PurposeInfo {
  purposecode?: string;
  purposeename?: string;
  purposetext?: string;
  purposetname?: string;
}

interface PurposeLookup {
  label: string;
  id: string;
  name: string;
  className?: string;
  modelValue: string;
  required?: boolean;
  errorMsg?: string;
  rules?: Yup.StringSchema;
}

const props = withDefaults(defineProps<PurposeLookup>(), {
  id: 'purpose',
  name: 'purpose',
  className: '',
  required: false,
  errorMsg: '',
  modelValue: '',
  rules: undefined,
});

const emit = defineEmits<{
  (e: 'update:modelValue', purposecode: string): void;
  (e: 'change', dataitem: PurposeInfo | null): void;
}>();

const fieldSchema = useField(toRef(props, 'name'), props.rules, {
  initialValue: props.modelValue || '',
});
const { errorMessage } = fieldSchema;
const isValid = computed((): boolean => {
  return errorMessage.value === undefined;
});

const lookupPurpose = ref<Array<object>>([]);
const items = ref<Array<object>>([]);
const purposecode = ref<string>(props.modelValue);
const purposeObject = ref<PurposeInfo>({} as PurposeInfo);
const isLoading = ref(true);

onMounted(async () => {
  try {
    lookupPurpose.value = await queryLookupPurpose();
    items.value = lookupPurpose.value.slice();
    setPurposeValue();
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
});

const queryLookupPurpose = async (): Promise<Array<object>> => {
  const lookupPurpose: Array<object> = [];
  try {
    const resLookupPurpose: { [key: string]: any } = await getResponseBody({
      url: useRuntimeConfig().public.baseApiStock + '/lookuppurpose/lookup',
      data: {
        from_date: '',
        to_date: '',
      },
    });
    if (resLookupPurpose.result === 'Y') {
      const purposeList = resLookupPurpose.lists;
      for (let list of purposeList) {
        list = {
          ...list,
          purposetext: list.purposecode + ' : ' + list.purposeename,
        };
        lookupPurpose.push(list);
      }
    }
    return lookupPurpose;
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};

const setPurposeValue = async () => {
  if (props.modelValue) {
    const findPurpose: any = await lookupPurpose.value.find((items: any) => {
      return items.purposecode === props.modelValue;
    });
    if (findPurpose) {
      purposeObject.value = {
        purposetext: findPurpose.purposecode + ' : ' + findPurpose.purposeename,
      };
    }
  } else {
    purposeObject.value = {
      purposetext: '',
    };
  }
};

const onChange = (event: any) => {
  isLoading.value = true;
  const dataItem: PurposeInfo | null = event.target.value;
  purposeObject.value = dataItem || { purposecode: '' };
  emit('update:modelValue', dataItem?.purposecode ?? '');
  emit('change', dataItem);
  isLoading.value = false;
};

const onFilterchange = (event: any) => {
  items.value = filterData(event.filter);
};

const filterData = (filter: FilterDescriptor) => {
  const data = lookupPurpose.value.slice();
  return filterBy(data, filter);
};

watch(
  () => props.modelValue,
  (value: string) => {
    purposecode.value = value;
    setPurposeValue();
  },
);
</script>

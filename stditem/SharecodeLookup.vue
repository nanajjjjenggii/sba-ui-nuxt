<template>
  <FormGroup
    :id="`${id}-lookup-box`"
    class="`stditem-sharecode-lookup form-group"
    :class="[className]"
  >
    <FormLabel :for="`${id}`" :required="required">
      หลักทรัพย์ / Symbol
    </FormLabel>
    <VeeField :id="id" v-model="sharecodePlain" type="hidden" :name="name" />
    <KendoComboBox
      v-if="!isInitial"
      :placeholder="`Symbol`"
      :disabled="isLoading"
      :loading="isLoading"
      :value="modelValue"
    />
    <KendoComboBox
      v-else
      :id="`${id}-input`"
      :value="sharecodeVal"
      :name="`${name}-input`"
      :enabled="!isLoading"
      :loading="isLoading"
      :placeholder="`Symbol`"
      :data-items="subsetData"
      :text-field="'sharecode'"
      :value-field="'sharecode'"
      :default-value="sharecodeVal"
      :valid="isValid"
      :allow-custom="true"
      :filterable="true"
      @filterchange="onFilterChange"
      @pagechange="pageChange"
      @keydown="
        ($event) => {
          if (regex.test($event.key)) {
            $event.preventDefault();
          }
        }
      "
      @change="onChange"
      @blur="onBlur($event)"
    />
    <InputErrorMsg v-if="!isValid" :for="id">
      {{ errorMessage }}
    </InputErrorMsg>
  </FormGroup>
</template>

<script setup lang="ts">
import * as Yup from 'yup';
import { ComboBox as KendoComboBox } from '@progress/kendo-vue-dropdowns';
import { filterBy } from '@progress/kendo-data-query';

export interface ShareCodeInfo {
  sharecode?: string;
  par?: string;
  keydate?: string;
  reason?: string;
  capital?: string;
  canresend?: string;
  xchgmkt?: string;
  regisflag?: string;
  shareid?: string;
  sdcflag?: string;
  mktcode?: string;
  result?: string;
  sharename?: string;
  sharetype?: string;
  resultcode?: string;
  msgtype?: string;
  board?: string;
}

type APIQuery = {
  condboard?: string;
  condxchgmkt?: string;
  condmktcode?: string;
  condsharetype?: string;
  condsdcflag?: string;
  shareid?: string;
};

type APIValidate = {
  sharecode: string;
  condboard?: string;
  condxchgmkt?: string;
  condmktcode?: string;
  condsharetype?: string;
  condsdcflag?: string;
  shareid?: string;
};

type SharecodeItem = {
  sharecode: string;
  sharename?: string;
};

interface SharecodeLookup {
  id?: string;
  name?: string;
  modelValue?: string;
  className?: string;
  required?: boolean;
  lookupParams?: APIQuery;
  validateParams?: APIValidate;

  /* vee-validate rules */
  rules?: Yup.StringSchema;
}

const props = withDefaults(defineProps<SharecodeLookup>(), {
  id: 'sharecode',
  name: 'sharecode',
  className: '',
  modelValue: '',
  required: false,
  errorMsg: '',
  lookupParams: () => {
    return {
      condboard: '',
      condxchgmkt: '',
      condmktcode: '',
      condsharetype: '',
      condsdcflag: '',
      shareid: '',
    };
  },
  validateParams: () => {
    return {
      sharecode: '',
      condboard: '',
      condxchgmkt: '',
      condmktcode: '',
      condsdcflag: '',
      condsharetype: '',
      shareid: '',
    };
  },
  rules: undefined,
});

const regex = /[^0-9a-zA-Z-&/\s]/s;
const fieldSchema = useField(
  toRef(props, 'name'),
  props.rules?.test(async (value, ctx) => {
    const resp: ShareCodeInfo | null = value
      ? await validateSharecode(value)
      : null;
    const result = resp?.result || 'N';
    let errorMsg = '';
    if (result !== 'Y') {
      errorMsg = resp?.reason || 'Something went wrong';
    }
    emit('change', resp);
    return result !== 'Y' ? ctx.createError({ message: errorMsg }) : true;
  }),
  {
    initialValue: props.modelValue || '',
  },
);
const { errorMessage, setErrors } = fieldSchema;

const sharecodePlain = ref<string>(props.modelValue || '');
const sharecodeVal = computed<SharecodeItem>(() => {
  return { sharecode: sharecodePlain.value || '' };
});
const isLoading: Ref<boolean> = ref(true);
const isInitial: Ref<boolean> = ref(false);
const isValid = computed((): boolean => {
  return errorMessage.value === undefined;
});

let isGetLookupSharecode = false;
const getLookupSharecode = async (): Promise<object[]> => {
  try {
    if (isGetLookupSharecode) throw new Error('Function is not available');
    isGetLookupSharecode = true;
    const response: { [key: string]: any } = await getResponseBody({
      url: useRuntimeConfig().public.baseApiUtil + '/lookupsharecode/collect',
      data: {
        condboard: props.lookupParams.condboard,
        condxchgmkt: props.lookupParams.condxchgmkt,
        condmktcode: props.lookupParams.condmktcode,
        condsharetype: props.lookupParams.condsharetype,
        condsdcflag: props.lookupParams.condsdcflag,
        shareid: props.lookupParams.shareid,
      } as APIQuery,
    });
    let lists: Array<SharecodeItem | never> = [];
    if (response) {
      if (response.result === 'Y' || response.resultcode === '1002') {
        lists = response.lists;
      }
    }
    return lists;
  } catch (error: any) {
    console.error(error);
    throw error;
  } finally {
    isGetLookupSharecode = false;
  }
};

const total = 10000;
const pageSize = 250;
const allData: Ref<object[]> = ref([]);
const subsetData = ref<object[]>([]);
const filteredData = ref<object[] | null>([]);
const skip = ref<number>(0);
const totalFilter = ref(total);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', dataitem: null | ShareCodeInfo): void;
}>();

const onFilterChange = (event: any): void => {
  console.log('💝 onFilterChange!');
  event.filter.operator = 'startswith';
  filteredData.value = filterBy(allData.value.slice(), event.filter);
  const data = filteredData.value.slice(0, pageSize);
  subsetData.value = data;
  skip.value = 0;
  totalFilter.value = filteredData.value.length;
};

const pageChange = (event: {
  page: { skip: number; take: number };
  target: any;
}) => {
  const eSkip = event.page.skip;
  const eTake = event.page.take;
  const newSubsetData = allData.value.slice(eSkip, eSkip + eTake);
  subsetData.value = newSubsetData;
  skip.value = eSkip;
};

const onChange = async (event: any): Promise<void> => {
  isLoading.value = true;
  const sharecode: string = event.value?.sharecode?.toUpperCase();
  await fieldSchema.setValue(sharecode);
  isLoading.value = false;
};

const onBlur = (event: any) => {
  fieldSchema.handleBlur(event);
};

const validateSharecode = async (
  sharecode: string,
): Promise<ShareCodeInfo | null> => {
  try {
    isLoading.value = true;
    const data: APIValidate = {
      sharecode: sharecode || '',
      condboard: props.validateParams.condboard,
      condxchgmkt: props.validateParams.condxchgmkt,
      condmktcode: props.validateParams.condmktcode,
      condsharetype: props.validateParams.condsharetype,
      condsdcflag: props.validateParams.condsdcflag,
      shareid: props.validateParams.shareid,
    };
    const response: ShareCodeInfo | null = await getResponseBody({
      url: useRuntimeConfig().public.baseApiUtil + '/validsharecode/retrieve',
      data,
    });
    return response;
  } catch (error) {
    console.log('# Catch!! 👹');
    console.error(error);
    setErrors(error as string);
    return null;
  } finally {
    isLoading.value = false;
  }
};

onMounted(async (): Promise<void> => {
  try {
    const response = await getLookupSharecode();
    if (response.length > 0) allData.value = response;
    subsetData.value = allData.value.slice(0, pageSize);
    filteredData.value = allData.value.slice();
  } catch (err) {
    console.log('👹Found Error!!');
  } finally {
    isLoading.value = false;
    isInitial.value = true;
  }
});

watch(
  () => props.modelValue,
  (value: string) => {
    // if (!value) emit('change', null);
    if (value) {
      sharecodePlain.value = value;
    } else {
      emit('change', null);
    }
  },
);
</script>
<style lang="scss" scoped>
.stditem-sharecode-lookup :deep(.k-combobox) {
  .k-input-inner {
    text-transform: uppercase;
    &::placeholder {
      text-transform: none;
    }
  }
}
</style>

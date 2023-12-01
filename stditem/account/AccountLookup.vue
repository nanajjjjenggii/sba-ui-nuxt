<template>
  <FormGroup
    :id="`${props.tagid}_box`"
    fs-component="account"
    class="account-group"
    :data-boxfor="`${props.tagid}`"
  >
    <div v-if="props.showAccLookuptype">
      <div :id="`${props.tagid}lktype-group`" class="row mt-0 mb-1">
        <FormRadio
          :id="`${props.tagid}lktype`"
          v-model="accounttype"
          :name="`${props.tagid}lktype`"
          no-label
          inline
          :radio-option-list="[
            { value: 'P', label: 'Private Cash' },
            { value: 'W', label: 'Wallet' },
          ]"
        />
      </div>
    </div>
    <div :id="`${props.tagid}field-group`" class="w-100 form-group">
      <FormLabel v-if="!props.showAccLookuptype" props.required>
        {{ props.textLabel }}
      </FormLabel>
      <VeeField
        :id="props.tagid"
        v-model="accountValiadte"
        :name="props.tagname"
        :bails="false"
        type="hidden"
      />
      <!-- <FormRow v-if="viewMode === false"> -->
      <div class="d-flex">
        <div
          v-if="props.viewMode === false"
          id="account-box"
          :class="`${props.accountClass} account-box pe-0 ${
            !isValid ? 'account-valid' : ''
          }`"
        >
          <KendoMaskedTextBox
            :id="props.tagid"
            :name="props.tagname"
            placeholder="Account"
            mask="000000-0"
            :value="accountDetail.account"
            class="account-input"
            fill-mode="null"
            @change="onChange"
            @blur="onBlur"
          >
          </KendoMaskedTextBox>
          <span
            class="k-clear-value acclk-clear"
            role="button"
            tabindex="-1"
            title="clear"
            @click="onClickClear"
          >
            <span class="k-icon k-i-x" role="presentation"></span>
          </span>
          <button
            class="k-button k-button-md k-icon-button k-button-solid k-button-solid-base k-input-button m-0 acclk-btn"
            aria-label="expand button"
            type="button"
            tabindex="-1"
            @click="toggleAccDialog"
          >
            <span
              class="k-icon k-i-caret-alt-down k-button-icon"
              role="presentation"
            ></span>
          </button>
        </div>
        <div
          v-if="props.showCustname"
          :class="`custname-input ${props.custnameClass}`"
        >
          <FormInput
            :id="props.custnameId"
            v-model="accountDetail.custname"
            no-label
            readonly
          />
        </div>
      </div>
      <InputErrorMsg v-if="!isValid" :for="props.tagid">
        {{ errorMessage }}
      </InputErrorMsg>
      <!-- </FormRow> -->
      <FormInput
        v-else-if="props.viewMode === true"
        :id="props.tagid"
        v-model="accountDetail.account"
        placeholder="N/A"
        no-label
        readonly
      />
    </div>
    <!-- Account Lookup Modal -->
    <CustomModal
      id="account-model"
      v-model="visibleAccDialog"
      size="lg"
      centered
    >
      <template #title>
        <HeaderBoxLabel v-if="accLookuptype === 'P'">
          Account Lookup
        </HeaderBoxLabel>
        <HeaderBoxLabel v-else-if="accLookuptype === 'W'">
          Wallet Lookup
        </HeaderBoxLabel>
      </template>
      <template #body>
        <AccountGrid
          :grid-data="lookupAcc"
          :columns="columns"
          @close-dialog="toggleAccDialog"
          @grid-selected="selectedValue"
        />
      </template>
    </CustomModal>
  </FormGroup>
</template>

<script setup lang="ts">
import * as Yup from 'yup';
import {
  MaskedTextBox as KendoMaskedTextBox,
  MaskedTextBoxChangeEvent,
} from '@progress/kendo-vue-inputs';
import { AccessorStores } from '~/stores/Accessor';

export interface AccountLookupList {
  account?: string;
  acctstatus?: string;
  branch?: string;
  cardid?: string;
  custacct?: string;
  custacctedesc?: string;
  custaccttdesc?: string;
  custcode?: string;
  custename?: string;
  custtname?: string;
  custtype?: string;
  mktid?: string;
}

export interface AccountGridColumn {
  title?: string;
  field?: string;
  width?: string;
}

export interface AccountValiadte {
  canresend?: string;
  cashcreditflag?: string;
  custacct?: string;
  custcode?: string;
  custtype?: string;
  enabledeposit?: string;
  enablewithdraw?: string;
  impactauthen?: string;
  impactfsbl?: string;
  impactifis?: string;
  impactifisd?: string;
  impactsba?: string;
  msgtype?: string;
  reason?: string;
  result?: string;
  resultcode?: string;
}

export interface validateAccountProps {
  validcandepwd: string;
  modulename: string;
  progname: string;
}

interface AccountLookupProps {
  viewMode?: boolean;
  tagid?: string;
  tagname?: string;
  value?: string;
  textLabel?: string;
  required?: boolean;
  accountClass?: string;
  showCustname?: boolean;
  custnameId?: string;
  custnameClass?: string;
  accLookuptype?: string;
  showAccLookuptype?: boolean;
  modelValue?: string;
  rules?: Yup.StringSchema;
  validateProps?: validateAccountProps;
}

const props = withDefaults(defineProps<AccountLookupProps>(), {
  viewMode: false,
  tagid: 'account',
  tagname: 'account',
  value: '',
  textLabel: 'Account',
  required: true,
  accountClass: 'col-12',
  showCustname: false,
  custnameId: 'custname',
  custnameClass: '',
  accLookuptype: 'P',
  showAccLookuptype: false,
  modelValue: '',
  rules: undefined,
  validateProps: () => {
    return {
      validcandepwd: 'N',
      modulename: 'STOCK',
      progname: 'SBSE001',
    };
  },
});
const emit = defineEmits<{
  (e: 'set-account-detail', value: string, result: string): void;
  (e: 'clear-account-detail'): void;
}>();

const fsAccessor = AccessorStores();
const fsLang: string = useRuntimeConfig().public.FS_LANG;
const accounttype = ref<string>('P');
const lookupAcc = ref<AccountLookupList[]>([] as AccountLookupList[]);
const columns = ref<AccountGridColumn[]>([] as AccountGridColumn[]);
const accountDetail = ref({
  account: '',
  custname: '',
  custacct: '',
});
let fieldAcctype = '';
let fieldName = '';
const accountValiadte = ref('');
const initAccount = ref(false);

const fieldSchema = useField(
  toRef(props, 'tagname'),
  props.rules?.test(async (_value, ctx) => {
    if (initAccount.value) {
      const resp: AccountValiadte | null = await validateAccount();
      const result = resp?.result ?? 'N';
      let errorMsg = '';
      let account = '';
      if (result !== 'Y') {
        errorMsg = resp?.reason ?? 'Something went wrong';
      } else {
        account = accountDetail.value.account;
      }
      emit('set-account-detail', account, result);
      initAccount.value = false;
      return result !== 'Y' ? ctx.createError({ message: errorMsg }) : true;
    }
    return true;
  }),
  {
    initialValue: accountDetail.value.account || '',
  },
);
const { errorMessage } = fieldSchema;
const isValid = computed((): boolean => {
  return errorMessage.value === undefined;
});

const visibleAccDialog = ref<boolean>(false);

onMounted(async () => {
  await queryLookupAccount();
  await getGridColumn();
  if (props.modelValue) {
    accountDetail.value.account = props.modelValue;
    accountValiadte.value = accountDetail.value.account;
    if (props.showCustname) {
      const findCustname: any = lookupAcc.value.find((items: any) => {
        return items.account === accountDetail.value.account;
      });
      accountDetail.value.custname = findCustname[fieldName];
    }
  }
});

watch(accounttype, async () => {
  await queryLookupAccount();
});

const queryLookupAccount = async (): Promise<void> => {
  try {
    let accttype = '';
    if (props.showAccLookuptype) {
      accttype = accounttype.value;
    } else {
      accttype = props.accLookuptype;
    }
    const resLookupAccount: { [key: string]: any } = await getResponseBody({
      url: useRuntimeConfig().public.baseApiUtil + '/lookupaccount/collect',
      data: {
        type: accttype,
      },
    });
    if (resLookupAccount.result === 'Y') {
      lookupAcc.value = resLookupAccount.lists;
    }
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};

const getGridColumn = (): void => {
  if (fsLang === 'TH') {
    fieldAcctype = 'custaccttdesc';
    fieldName = 'custtname';
  } else {
    fieldAcctype = 'custacctedesc';
    fieldName = 'custename';
  }
  columns.value = [
    {
      title: 'Account',
      field: 'account',
      width: '100',
    },
    {
      title: 'Account Type',
      field: fieldAcctype,
      width: '200',
    },
    {
      title: 'Name',
      field: fieldName,
      width: 'auto',
    },
  ];
};

const toggleAccDialog = (): boolean => {
  return (visibleAccDialog.value = !visibleAccDialog.value);
};

const selectedValue = (accountItem: AccountLookupList): void => {
  initAccount.value = true;
  accountDetail.value.account = accountItem.account || '';
  accountDetail.value.custacct = accountItem.custacct || '';
  accountDetail.value.custname =
    fsLang === 'TH' ? accountItem.custtname || '' : accountItem.custename || '';
  accountValiadte.value = accountDetail.value.account;
};

const onClickClear = (): void => {
  accountDetail.value.account = '';
  accountDetail.value.custname = '';
  accountDetail.value.custacct = '';
  accountValiadte.value = '';
  initAccount.value = false;
  emit('clear-account-detail');
};

const onChange = (event: MaskedTextBoxChangeEvent): void => {
  initAccount.value = true;
  const account = event.target.value;
  if (accountDetail.value.account !== account) {
    accountDetail.value.account = account;
    accountValiadte.value = accountDetail.value.account;
  }
};

const onBlur = (event: any): void => {
  initAccount.value = true;
  const accountItem = lookupAcc.value.filter(
    (item: AccountLookupList) => item.account === event.target.value,
  );
  if (accountItem[0]) {
    accountDetail.value.account = accountItem[0].account || '';
    accountDetail.value.custname =
      fsLang === 'TH'
        ? accountItem[0].custtname || ''
        : accountItem[0].custename || '';
    accountDetail.value.custacct = accountItem[0].custacct || '';
    accountValiadte.value = accountDetail.value.account;
  }
};

const validateAccount = async (): Promise<AccountValiadte | null> => {
  try {
    const resValidateAccount: AccountValiadte | null = await getResponseBody({
      url: useRuntimeConfig().public.baseApiUtil + '/validaccount/retrieve',
      data: {
        account: accountDetail.value.account,
        custacct: accountDetail.value.custacct,
        xchgmkt: '1',
        sblflag: '',
        date: fsAccessor.data.fsSystemDate,
        moduletype: 'S',
        validcandepwd: props.validateProps.validcandepwd,
        progname: props.validateProps.progname,
        modulename: props.validateProps.modulename,
      },
    });
    return resValidateAccount;
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};

watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      accountDetail.value.account = value;
      accountValiadte.value = accountDetail.value.account;
    }
  },
);
</script>

<style scope>
.account-box {
  display: flex;
  padding: 0 !important;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  color: #424242;
  background-color: #ffffff;
}

.account-input {
  border: none !important;
}

.account-valid {
  border: 1px solid red;
}

.custname-input {
  margin-left: calc(var(--mdb-gutter-x) * 0.5);
}

.acclk-clear {
  width: 24px;
  height: 24px;
}

.acclk-btn {
  border-radius: 4px;
}
</style>

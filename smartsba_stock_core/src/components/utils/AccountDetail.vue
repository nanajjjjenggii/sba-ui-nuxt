<template>
  <div id="DepositoryInformation">
    <HeaderBoxLabel v-if="labelInBox === false">{{ title }}</HeaderBoxLabel>
    <DivRowBorder>
      <HeaderBoxLabel v-if="labelInBox === true">{{ title }}</HeaderBoxLabel>
      <FormRow>
        <FormGroup class-name="col-sm-12 col-md-3">
          <AccountLookup
            :model-value="depInfo.account"
            :view-mode="viewMode"
            :tagid="detailPage.account.id"
            :tagname="detailPage.account.name"
            :value="depInfo.account"
            :text-label="'เลขที่บัญชีหลักทรัพย์ / Account'"
            :required="true"
            :account-class="acclookupClass"
            :show-custname="showCustName"
            :custname-id="'custname'"
            :custname-class="custnameClass"
            :acc-lookuptype="'P'"
            :show-acc-lookuptype="false"
            :rules="$Yup.string().label('Account').required()"
            :validate-props="props.validateAccount"
            @set-account-detail="queryInqstkaccdetail"
            @clear-account-detail="clearAccountDetail(true)"
          />
        </FormGroup>
        <FormGroup class-name="col-sm-12 offset-md-1 col-md-3">
          <FormInput
            v-if="props.viewMode === true || depAcctReadOnly === true"
            :id="detailPage.depacc.id"
            v-model="depInfo.depacc"
            label="Depository Account"
            :input-name="detailPage.depacc.name"
            placeholder="N/A"
            readonly
          />
          <DepositoryAccountLookup
            v-else-if="props.viewMode === false || depAcctReadOnly === false"
            :id="detailPage.depacc.id"
            v-model="depInfo.depacc"
            :name="detailPage.depacc.name"
            :lookup-depacct="lookupDepAcct"
            :rules="$Yup.string().label('Depository Account').required()"
          />
        </FormGroup>
        <FormGroup class-name="col-sm-12 offset-md-1 col-md-3">
          <FormInput
            :id="detailPage.cardid.id"
            v-model="depInfo.cardid"
            label="เลขประจำตัวประชาชน / Card ID"
            :input-name="detailPage.cardid.id"
            placeholder="N/A"
            readonly
          />
        </FormGroup>
      </FormRow>
      <FormRow>
        <FormGroup class-name="col-sm-12 col-md-3">
          <FormInput
            :id="detailPage.prefixcode.id"
            v-model="depInfo.prefixcode"
            label="รหัสคำนำหน้า / Prefix Code"
            :input-name="detailPage.prefixcode.id"
            placeholder="N/A"
            readonly
          />
        </FormGroup>
        <FormGroup class-name="col-sm-12 offset-md-1 col-md-3">
          <FormInput
            v-if="prefixcodeReadonly === true"
            :id="detailPage.prefixdesc.id"
            v-model="depInfo.prefixdesc"
            label="คำนำหน้า / Prefix Desc."
            :input-name="detailPage.prefixdesc.id"
            placeholder="N/A"
            readonly
          />
          <FormInput
            v-else
            :id="detailPage.prefixdesc.id"
            v-model="depInfo.prefixdesc"
            label="คำนำหน้า / Prefix Desc."
            :input-name="detailPage.prefixdesc.id"
            placeholder="N/A"
            required
            :rules="$Yup.string().label('Prefix Desc.').required()"
          />
        </FormGroup>
        <FormGroup class-name="col-sm-12 offset-md-1 col-md-4">
          <FormInput
            :id="detailPage.custname.id"
            v-model="depInfo.custname"
            label="ชื่อ-นามสกุลของลูกค้า / Customer Name"
            :input-name="detailPage.custname.id"
            placeholder="N/A"
            readonly
          />
        </FormGroup>
      </FormRow>
      <slot name="newline"></slot>
    </DivRowBorder>
  </div>
</template>

<script setup lang="ts">
import { validateAccountProps } from '~/components/stditem/account/AccountLookup.vue';
import { DepacctLookup } from '~/components/utils/DepositoryAccountLookup.vue';

interface SubDetailPageType {
  id: string;
  name: string;
  require: boolean;
}

export interface DetailPageType {
  account: SubDetailPageType;
  depacc: SubDetailPageType;
  cardid: SubDetailPageType;
  prefixcode: SubDetailPageType;
  prefixdesc: SubDetailPageType;
  custname: SubDetailPageType;
}

export interface AccDetail {
  account: string;
  depacc: string;
  cardid: string;
  prefixcode: string;
  prefixdesc: string;
  custname: string;
  custtype: string;
  custcode: string;
  custacct: string;
  dpaccount: string;
  firstname: string;
  lastname: string;
  custodianflag: string;
}

interface AccountDetailProps {
  title: string;
  viewMode: boolean;
  labelInBox?: boolean;
  showCustName?: boolean;
  modelValue: AccDetail;
  detailPage: DetailPageType;
  validateAccount: validateAccountProps;
  errorMsg?: string;
}

const props = withDefaults(defineProps<AccountDetailProps>(), {
  labelInBox: false,
  showCustName: false,
  modelValue: () => {
    return {
      account: '',
      depacc: '',
      cardid: '',
      prefixcode: '',
      prefixdesc: '',
      custname: '',
      custtype: '',
      custcode: '',
      custacct: '',
      dpaccount: '',
      firstname: '',
      lastname: '',
      custodianflag: '',
    };
  },
  validateAccount: () => {
    return {
      validcandepwd: 'N',
      modulename: 'STOCK',
      progname: 'SBSE001',
    };
  },
  errorMsg: '',
});

const emit = defineEmits<{
  (e: 'update:modelValue', AccDetail: AccDetail | null): void;
}>();

const depInfo = ref<AccDetail>({} as AccDetail);
const prefixcodeReadonly = ref<boolean>(true);
const depAcctReadOnly = ref<boolean>(true);
const lookupDepAcct = ref<DepacctLookup[]>([] as DepacctLookup[]);
const acclookupClass = ref<string>('');
const custnameClass = ref<string>('');

onMounted(() => {
  if (props.showCustName) {
    acclookupClass.value = 'col-sm-12 col-md-6 col-lg-6 mb-0';
    custnameClass.value = 'col-sm-12 col-md-6 col-lg-6 mb-0';
  } else {
    acclookupClass.value = 'col-12';
    custnameClass.value = '';
  }
  if (props.modelValue) initialValue();
});

const initialValue = () => {
  depInfo.value.account = props.modelValue.account;
  depInfo.value.depacc = props.modelValue.depacc;
  depInfo.value.cardid = props.modelValue.cardid;
  depInfo.value.prefixcode = props.modelValue.prefixcode;
  depInfo.value.prefixdesc = props.modelValue.prefixdesc;
  depInfo.value.custname = props.modelValue.custname;
};

const queryInqstkaccdetail = async (
  account: string,
  result: string,
): Promise<void> => {
  try {
    clearAccountDetail(false);
    depInfo.value.account = account;
    if (result === 'Y') {
      const resInqSTKAccDetail: { [key: string]: any } = await getResponseBody({
        url:
          useRuntimeConfig().public.baseApiStock + '/inqstkaccdetail/inquiry',
        data: {
          account: depInfo.value.account,
        },
      });
      if (resInqSTKAccDetail.result === 'Y') {
        setAccountDetail(resInqSTKAccDetail);
      }
    }
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};

const setAccountDetail = (result: any): void => {
  if (result.USEOMNIBUS === '1') {
    depAcctReadOnly.value = false;
    queryLookupDepAcct(result.pcflag);
  } else {
    depAcctReadOnly.value = true;
  }
  depInfo.value.depacc = result.dpaccount;
  depInfo.value.cardid = result.cardid;
  depInfo.value.prefixcode = result.titlecode;
  depInfo.value.prefixdesc = result.titlename;
  depInfo.value.custname = result.custname;
  depInfo.value.custtype = result.custtype;
  depInfo.value.custcode = result.custcode;
  depInfo.value.custacct = result.custacct;
  depInfo.value.dpaccount = result.dpaccount;
  depInfo.value.firstname = result.firstname;
  depInfo.value.lastname = result.lastname;
  depInfo.value.custodianflag = result.custodianflag;

  if (result.titlename === 'อื่น ๆ') {
    prefixcodeReadonly.value = false;
  }
  emit('update:modelValue', depInfo.value);
};

const queryLookupDepAcct = async (pcflagValue: string): Promise<void> => {
  try {
    const resLookupDepAcct: { [key: string]: any } = await getResponseBody({
      url: useRuntimeConfig().public.baseApiStock + '/lookupdepacct/lookup',
      data: {
        pcflag: pcflagValue,
      },
    });
    if (resLookupDepAcct.result === 'Y') {
      lookupDepAcct.value = resLookupDepAcct.lists;
    }
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};

const clearAccountDetail = (clickclear: boolean): void => {
  lookupDepAcct.value = [];
  depInfo.value.account = clickclear ? '' : depInfo.value.account;
  depInfo.value.depacc = '';
  depInfo.value.cardid = '';
  depInfo.value.prefixcode = '';
  depInfo.value.prefixdesc = '';
  depInfo.value.custname = '';
  depInfo.value.custtype = '';
  depInfo.value.custcode = '';
  depInfo.value.custacct = '';
  depInfo.value.dpaccount = '';
  depInfo.value.firstname = '';
  depInfo.value.lastname = '';
  depInfo.value.custodianflag = '';
  prefixcodeReadonly.value = true;
  depAcctReadOnly.value = true;
  emit('update:modelValue', depInfo.value);
};

watch(
  () => props.modelValue.account,
  (value) => {
    if (value) {
      initialValue();
      queryInqstkaccdetail(value, 'Y');
    }
  },
);

watch(
  () => props.validateAccount,
  () => {},
);
</script>

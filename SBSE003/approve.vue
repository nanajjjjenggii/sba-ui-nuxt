<template>
  <LayoutProgram>
    <template #title>Request Form</template>
    <template #subtitle>TC : {{ subtitle }} Transaction</template>
    <template #body>
      <TransactionInfoBox
        :action="form.action"
        :actionmode="form.actionmode"
        :transinfo="transinfoBox"
      />
      <FormDiv @submit.prevent>
        <!-- ข้อมูลเลขที่บัญชีหลักทรัพย์ผู้โอน -->
        <LazyAccountDetail
          v-model="faccountData"
          :title="`ข้อมูลเลขที่บัญชีหลักทรัพย์ผู้โอน / Transferer’s Information`"
          :label-in-box="true"
          :view-mode="useViewMode"
          :detail-page="sbse003.FAccountDetail"
          :validate-account="{
            validcandepwd: 'W' /* W */,
            modulename: 'STOCK',
            progname: sbse003.progname,
          }"
        />
        <!-- ข้อมูลเลขที่บัญชีหลักทรัพย์ผู้รับ -->
        <LazyAccountDetail
          v-model="taccountData"
          :title="`ข้อมูลเลขที่บัญชีหลักทรัพย์ผู้รับ / Transferee’s Information`"
          :label-in-box="true"
          :view-mode="useViewMode"
          :detail-page="sbse003.TAccountDetail"
          :validate-account="{
            validcandepwd: 'D' /* D */,
            modulename: 'STOCK',
            progname: sbse003.progname,
          }"
        />
        <div>
          <HeaderBoxLabel class="mb-0">
            รายละเอียดการทำรายการ / Request Lists of Transaction
          </HeaderBoxLabel>
          <DivRowBorder>
            <EditTransactionDetails
              v-if="dataItem.actionmode !== 'D'"
              v-model="transaction"
              :avg-price-params="avgpriceParams"
            />
            <TransactionDetails
              v-else-if="dataItem.actionmode === 'D'"
              :data-list="dataItem"
            />
          </DivRowBorder>
        </div>
        <LazyPreviousCommentBox :commentlist="commentlists" />
        <LazyWorkflowButton
          :default-btn="`Cancel`"
          :product="`SBA_STOCK`"
          :taskname="sbse003.taskname"
          :applicationid="form.applicationid"
          @action-flow="actionFlowButtonInit"
        />
      </FormDiv>
      <CommentConfirmPopup
        v-show="showConfirmPopup"
        v-model="form.comment"
        :required="isReqReason"
        :actiontype="form.actiontype"
        @cancel="cancelConfirmPopup()"
        @confirm="handleSubmitData()"
      />
    </template>
  </LayoutProgram>
</template>
<script setup lang="ts">
import { useForm } from 'vee-validate';
import sbse003 from './ts/sbse003';
import TransactionInfoBox from './components/TransactionInfoBox.vue';
import {
  FormTypes,
  EditTransDetailTypes,
  TransDetailTypes,
} from './ts/sbse003_types';
import { AccDetail } from '~/components/utils/AccountDetail.vue';
import { CommentLists } from '~/components/stditem/Comment/CommentTypes';
import { AccessorStores } from '~/stores/Accessor';
const TransactionDetails = defineAsyncComponent(
  () => import('./components/TransactionDetails.vue'),
);
const EditTransactionDetails = defineAsyncComponent(
  () => import('./components/EditTransactionDetails.vue'),
);
const route = useRoute();
const fsAccessor = AccessorStores();
const subtitle = ref('');
const canEdit = await fsAccessor.getPermissionItem('SBSE003')?.update;
const useViewMode = ref<boolean>(true);
const formControl = useForm<FormTypes>();
const form = reactive<FormTypes>(sbse003.Form);
const faccountData = ref<AccDetail>({} as AccDetail);
const taccountData = ref<AccDetail>({} as AccDetail);
const showConfirmPopup = ref<boolean>(false);
const commentlists = ref<CommentLists[]>([]);
const avgpriceParams = reactive({
  custtype: faccountData.value?.custtype || '',
  custacct: faccountData.value?.custacct || '',
  custcode: faccountData.value?.custcode || '',
});
const transinfoBox = ref({
  applicationid: '',
  createdate: '',
  createuser: '',
  channel: '',
  statusname: '',
  referno: '',
});
// const transaction = ref<EditTransDetailTypes>({} as EditTransDetailTypes);
const transaction = reactive<EditTransDetailTypes>({} as EditTransDetailTypes);
provide('transdetail', transaction);
console.log('# sbse003: ', sbse003);
console.log('# Transdetail: ', sbse003.Transdetail);

const response = ref<{ [key: string]: any }>({});
const dataItem = ref<TransDetailTypes>({} as TransDetailTypes);
const initialValues = (datas: { [key: string]: any }) => {
  console.log('# initialValues: ');
  console.log('# datas: ', datas);
  switch (datas.actionmode) {
    case 'E':
      subtitle.value = 'Edit';
      break;
    case 'D':
      subtitle.value = 'Delete';
      break;
    default:
      subtitle.value = 'Add';
  }
  // Transaction's info box
  transinfoBox.value = {
    applicationid: route.query.applicationid as string,
    createdate: datas.createdate,
    createuser: datas.createuser,
    channel: datas.channel,
    statusname: datas.statusname,
    referno: datas.referno,
  };

  // useViewMode.value = !(datas.actionmode !== 'D' && canEdit);
  // useViewMode.value =
  dataItem.value = datas as TransDetailTypes;
  // Editdraft's Form
  form.actionmode = datas.actionmode;
  form.action = datas.action;
  form.reftype = datas.reftype;
  /* ข้อมูลจากฝั่ง Transferee */
  form.sharecode = datas.tsharecode;
  form.purpose = datas.tpurpose;
  form.custtype = datas.tcusttype;
  form.custacct = datas.tcustacct;
  form.custcode = datas.tcustcode;
  form.account = datas.taccount;
  form.dpaccount = datas.tdpaccount;
  form.title = datas.ttitlecode;
  taccountData.value = {
    account: datas.taccount,
    depacc: datas.tdepacc,
    cardid: datas.tcardid,
    prefixcode: datas.tprefixcode,
    prefixdesc: datas.tprefixdesc,
    custname: datas.tcustname,
    custtype: datas.tcusttype,
    custcode: datas.tcustcode,
    custacct: datas.tcustacct,
    dpaccount: datas.tdpaccount,
    firstname: datas.tfirstname,
    lastname: datas.tlastname,
  } as AccDetail;
  /* ข้อมูลจากฝั่ง Transferer */
  form.sharecode2 = datas.fsharecode;
  form.purpose2 = datas.fpurpose;
  form.custtype2 = datas.fcusttype;
  form.custacct2 = datas.fcustacct;
  form.custcode2 = datas.fcustcode;
  form.account2 = datas.faccount;
  form.dpaccount2 = datas.fdpaccount;
  form.titlecode2 = datas.ftitlecode;
  form.firstname2 = datas.firstname;
  form.lastname2 = datas.lastname;
  form.cardid2 = datas.fcardid;
  faccountData.value = {
    account: datas.faccount,
    depacc: datas.fdepacc,
    cardid: datas.fcardid,
    prefixcode: datas.fprefixcode,
    prefixdesc: datas.fprefixdesc,
    custname: datas.fcustname,
    custtype: datas.fcusttype,
    custcode: datas.fcustcode,
    custacct: datas.fcustacct,
    dpaccount: datas.fdpaccount,
    firstname: datas.ffirstname,
    lastname: datas.flastname,
  } as AccDetail;
  /* ข้อมูล Transaction Details */
  form.unit = datas.unit;
  form.avgprice = datas.avgprice;
  form.xdate = datas.xdate;
  form.tradeflag = datas.tradeflag;
  form.corptxndt = datas.corptxndt;
  form.objective = datas.objective;
  form.remark = datas.remark;
  form.shortrefer = datas.shortrefer;
  form.channel = datas.channel;
  form.xchgmkt = datas.fxchgmkt;
  // form.board: string /* ไม่ต้องส่งค่า */;

  commentlists.value = datas.commentlists;

  transaction.account = form.account;
  transaction.sharecode = form.sharecode;
  transaction.mktcode = datas.mktcode;
  transaction.regisflag = datas.regisflag === '1';
  transaction.fpurpose = form.purpose2;
  transaction.corprefer = datas.corprefer;
  transaction.xdate = form.xdate;
  transaction.avgprice = form.avgprice;
  transaction.tradeflag = form.tradeflag;
  transaction.tpurpose = form.purpose2;
  transaction.objective = form.objective;
  transaction.remark = form.remark;
  transaction.unit = form.unit;
};

const handleSubmitData = async () => {
  const newValue = formControl.values;
  const newLists = [];
  if (form.actiontype === 'P' && canEdit) {
    newLists.push({
      ...form,
      sharecode: transaction.sharecode,
      purpose: transaction.tpurpose,
      sharecode2: transaction.sharecode,
      purpose2: transaction.fpurpose,
      /* ค่าจาก Transferee */
      custtype: taccountData.value.custtype,
      custacct: taccountData.value.custacct,
      custcode: taccountData.value.custcode,
      account: taccountData.value.account,
      dpaccount: taccountData.value.dpaccount,
      title: taccountData.value.prefixdesc,
      /* ค่าจาก Transferer */
      custtype2: faccountData.value.custtype,
      custacct2: faccountData.value.custacct,
      custcode2: faccountData.value.custcode,
      account2: faccountData.value.account,
      dpaccount2: faccountData.value.dpaccount,
      title2: faccountData.value.prefixdesc,
      /* ค่าจาก Transaction Details */
      unit: transaction.unit,
      avgprice: transaction.avgprice,
      xdate: transaction.xdate || '',
      tradeflag: transaction.tradeflag,
      corptxndt: newValue.corptxndt || '',
      corptxntype: newValue.corptxntype || '',
      corptxnno: newValue.corptxnno || '',
      objective: transaction.objective,
      remark: transaction.remark,
      userid: fsAccessor.getUser,
    });
  } else {
    newLists.push({
      taskname: form.taskname,
      applicationid: form.applicationid,
      comment: form.comment,
    });
  }

  console.log('# stkManageTrans | data: ', {
    progname: sbse003.progname,
    lists: newLists,
  });

  let resp: { [key: string]: any } = {};
  if (form.actiontype === 'P') {
    /* Can Edit */
    if (canEdit) {
      resp = await stkManageTrans(
        {
          progname: sbse003.progname,
          lists: newLists,
        },
        form.actionmode,
      );
    } else {
      resp = await approveSTKTrans({
        progname: sbse003.progname,
        lists: newLists,
      });
    }
  } else if (form.actiontype === 'R') {
    resp = await returnSTKTrans({
      progname: sbse003.progname,
      lists: newLists,
    });
  } else if (form.actiontype === 'J') {
    resp = await rejectSTKTrans({
      progname: sbse003.progname,
      lists: newLists,
    });
  }

  console.log('# response.lists: ', resp.lists);
  // const responseData = reactive<Response>({ lists: [] });
  const responseData = reactive(sbse003.response);
  if (resp.lists.length > 0) responseData.lists = resp.lists;

  await sbse003.responseToResultPage('approve');
};

const actionFlowButtonInit = async (
  step: string,
  doaction: string,
  doactiontype: string,
): Promise<void | boolean> => {
  console.log('# step: ', step);
  console.log('# doaction: ', doaction);
  console.log('# doactiontype: ', doactiontype);
  form.action = doaction;
  form.actiontype = doactiontype;
  console.log('# formControl: ', formControl);

  console.log('# Form-values: ', formControl.values);
  console.log('# Form-formapprv: ', form);
  if (doactiontype === 'P') {
    const validate = await formControl.validate();
    console.log('# validate: ', validate);
    if (!validate.valid) return false;
  }
  showConfirmPopup.value = true;
};

const cancelConfirmPopup = () => {
  showConfirmPopup.value = false;
  form.actiontype = '';
  form.comment = '';
};

onBeforeMount(async () => {
  console.log('onMounted !!');
  if (route.query) form.applicationid = route.query.applicationid as string;
  response.value = await sbse003.getInqJornalSTKDetail(form.applicationid);
  if (response.value) {
    initialValues(response.value);
  }
});

const isReqReason = ref<boolean>(true);
watch(
  () => form.actiontype,
  async (actiontype: string) => {
    const resp: { [key: string]: any } = await setReqReason({
      taskname: form.taskname,
      applicationid: form.applicationid,
      actiontype,
    });
    isReqReason.value = resp?.result === 'Y' || true;
  },
);
</script>

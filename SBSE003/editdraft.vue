<template>
  <LayoutProgram>
    <template #title>Request Form</template>
    <template #subtitle>TC : {{ subtitle }} Transaction</template>
    <template #body>
      <TransactionInfoBox
        :action="formdraft.action"
        :actionmode="formdraft.actionmode"
        :transinfo="transinfoBox"
      />
      <FormDiv @submit.prevent>
        <!-- ข้อมูลเลขที่บัญชีหลักทรัพย์ผู้โอน -->
        <LazyAccountDetail
          v-model="faccountData"
          :title="`ข้อมูลเลขที่บัญชีหลักทรัพย์ผู้โอน / Transferer’s Information`"
          :label-in-box="true"
          :view-mode="false"
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
          :view-mode="false"
          :detail-page="sbse003.TAccountDetail"
          :validate-account="{
            validcandepwd: 'W' /* D */,
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
              v-model="transaction"
              :avg-price-params="avgpriceParams"
            />
          </DivRowBorder>
        </div>
        <LazyPreviousCommentBox :commentlist="commentlists" />
        <LazyCommentBox
          v-model="formdraft.comment"
          :commentlist="commentlists"
        />
        <LazyWorkflowButton
          :default-btn="`Cancel`"
          product="SBA_STOCK"
          :taskname="sbse003.taskname"
          :applicationid="formdraft.applicationid"
          @action-flow="actionFlowButtonInit"
        />
      </FormDiv>
    </template>
  </LayoutProgram>
</template>
<script setup lang="ts">
import { useForm } from 'vee-validate';
import TransactionInfoBox from './components/TransactionInfoBox.vue';
import EditTransactionDetails from './components/EditTransactionDetails.vue';
import sbse003, { ResponseTypes } from './ts/sbse003';
import { FormTypes, EditTransDetailTypes } from './ts/sbse003_types';
import { AccDetail } from '~/components/utils/AccountDetail.vue';
import { CommentLists } from '~/components/stditem/Comment/CommentTypes';
import { AccessorStores } from '~/stores/Accessor';

const formControl = useForm<FormTypes>();
const formdraft = reactive<FormTypes>(sbse003.Form);
const faccountData = ref<AccDetail>({} as AccDetail);
const taccountData = ref<AccDetail>({} as AccDetail);
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
const route = useRoute();
const fsAccessor = AccessorStores();
const subtitle = ref('');
// const transaction = ref<EditTransDetailTypes>({} as EditTransDetailTypes);
const transaction = reactive<EditTransDetailTypes>({} as EditTransDetailTypes);
provide('transdetail', transaction);
console.log('# sbse003: ', sbse003);
console.log('# Transdetail: ', sbse003.Transdetail);

const initialValues = (response: { [key: string]: any }) => {
  console.log('# initialValues: ');
  console.log('# response: ', response);
  switch (response.actionmode) {
    case 'U':
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
    createdate: response.createdate,
    createuser: response.createuser,
    channel: response.channel,
    statusname: response.statusname,
    referno: response.referno,
  };

  // Editdraft's Form
  formdraft.actionmode = response.actionmode;
  formdraft.action = response.action;
  // formdraft.applicationid = response.applicationid;
  formdraft.refapplicationid = response.refapplicationid;
  formdraft.refno = response.refno;
  formdraft.reftype = response.reftype;
  formdraft.refdate = response.refdate;
  /* ข้อมูลจากฝั่ง Transferee */
  formdraft.sharecode = response.tsharecode;
  formdraft.purpose = response.tpurpose;
  formdraft.custtype = response.tcusttype;
  formdraft.custacct = response.tcustacct;
  formdraft.custcode = response.tcustcode;
  formdraft.account = response.taccount;
  formdraft.dpaccount = response.tdpaccount;
  formdraft.title = response.ttitlecode;
  taccountData.value = {
    account: response.taccount,
    depacc: response.tdepacc,
    cardid: response.tcardid,
    prefixcode: response.tprefixcode,
    prefixdesc: response.tprefixdesc,
    custname: response.tcustname,
    custtype: response.tcusttype,
    custcode: response.tcustcode,
    custacct: response.tcustacct,
    dpaccount: response.tdpaccount,
    firstname: response.tfirstname,
    lastname: response.tlastname,
  } as AccDetail;
  /* ข้อมูลจากฝั่ง Transferer */
  formdraft.sharecode2 = response.fsharecode;
  formdraft.purpose2 = response.fpurpose;
  formdraft.custtype2 = response.fcusttype;
  formdraft.custacct2 = response.fcustacct;
  formdraft.custcode2 = response.fcustcode;
  formdraft.account2 = response.faccount;
  formdraft.dpaccount2 = response.fdpaccount;
  formdraft.titlecode2 = response.ftitlecode;
  formdraft.firstname2 = response.firstname;
  formdraft.lastname2 = response.lastname;
  formdraft.cardid2 = response.fcardid;
  faccountData.value = {
    account: response.faccount,
    depacc: response.fdepacc,
    cardid: response.fcardid,
    prefixcode: response.fprefixcode,
    prefixdesc: response.fprefixdesc,
    custname: response.fcustname,
    custtype: response.fcusttype,
    custcode: response.fcustcode,
    custacct: response.fcustacct,
    dpaccount: response.fdpaccount,
    firstname: response.ffirstname,
    lastname: response.flastname,
  } as AccDetail;
  /* ข้อมูล Transaction Details */
  formdraft.unit = response.unit;
  formdraft.avgprice = response.avgprice;
  formdraft.xdate = response.xdate;
  formdraft.tradeflag = response.tradeflag;
  formdraft.corptxndt = response.corptxndt;
  formdraft.objective = response.objective;
  formdraft.remark = response.remark;
  formdraft.shortrefer = response.shortrefer;
  formdraft.channel = response.channel;
  formdraft.xchgmkt = response.fxchgmkt;
  // formdraft.board: string /* ไม่ต้องส่งค่า */;

  commentlists.value = response.commentlists;

  transaction.account = formdraft.account;
  transaction.sharecode = formdraft.sharecode;
  transaction.mktcode = response.mktcode;
  transaction.regisflag = response.regisflag === '1';
  transaction.fpurpose = formdraft.purpose2;
  transaction.corprefer = response.corprefer;
  transaction.avgprice = formdraft.avgprice;
  transaction.tradeflag = formdraft.tradeflag;
  transaction.xdate = formdraft.xdate;
  transaction.tpurpose = formdraft.purpose;
  transaction.objective = formdraft.objective;
  transaction.remark = formdraft.remark;
  transaction.unit = formdraft.unit;
};

const handleSubmitData = (): void => {
  console.log('# handleSubmitData!!!');
  const newValue = formControl.values;
  console.log('# newValue: ', newValue);
  console.log('# formdraft: ', formdraft);
  console.log('# transaction: ', transaction);

  popup.confirmActionFlow({
    actiontype: formdraft.actiontype,
    confirm: async function () {
      console.log('# flow confirm Action!');
      const newLists = [];
      newLists.push({
        ...formdraft,
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

      console.log('# stkManageTrans | data: ', {
        progname: 'sbse003',
        lists: newLists,
      });

      const response: { [key: string]: any } = await stkManageTrans(
        {
          progname: sbse003.progname,
          lists: newLists,
        },
        formdraft.actionmode,
      );

      console.log('# response.lists: ', response.lists);
      const responseData = reactive<ResponseTypes>(sbse003.response);
      responseData.lists.push(...response.lists);

      await sbse003.responseToResultPage('editdraft');
    },
    cancel: function () {
      console.log('# flow cancel Action!');
    },
  });
};

const actionFlowButtonInit = async (
  step: string,
  doaction: string,
  doactiontype: string,
): Promise<void | boolean> => {
  console.log('# step: ', step);
  console.log('# doaction: ', doaction);
  console.log('# doactiontype: ', doactiontype);
  formdraft.action = doaction;
  formdraft.actiontype = doactiontype;
  console.log('# formControl: ', formControl);

  console.log('# Form-values: ', formControl.values);
  console.log('# Form-formdraft: ', formdraft);
  if (doactiontype !== 'D') {
    const validate = await formControl.validate();
    console.log('# validate: ', validate);
    if (!validate.valid) return false;
  }
  // sbse003.handleSubmitData(formControl.values, formdraft, 'editdraft');
  handleSubmitData();
};

// onBeforeMount(async () => {
//   console.log('onBeforeMount !!');
onBeforeMount(async () => {
  console.log('onMounted !!');
  if (route.query)
    formdraft.applicationid = route.query.applicationid as string;
  const response = await sbse003.getInqJornalSTKDetail(formdraft.applicationid);
  if (response) {
    initialValues(response);
  }
});
</script>

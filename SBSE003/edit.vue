<template>
  <div>
    <LayoutProgram id="sbse003-view-page">
      <template #title>View Transaction</template>
      <template #subtitle>TC</template>
      <template #body>
        <!-- ข้อมูลของใบคำร้องของอนุมัติ / Application Info -->
        <TransactionInfoBox
          :actionmode="actionmode"
          :transinfo="transinfoBox"
          :view-mode="true"
        />
        <!-- ข้อมูลเลขที่บัญชีหลักทรัพย์ผู้รับ -->
        <LazyAccountDetail
          v-model="faccountData"
          :title="`ข้อมูลเลขที่บัญชีหลักทรัพย์ผู้โอน / Transferer’s Information`"
          :detail-page="sbse003.FAccountDetail"
          :view-mode="false"
          :validate-account="{
            validcandepwd: 'W' /* W */,
            modulename: 'STOCK',
            progname: sbse003.progname,
          }"
        />
        <!-- ข้อมูลเลขที่บัญชีหลักทรัพย์ผู้รับ -->
        <AccountDetail
          v-model="taccountData"
          :title="`ข้อมูลเลขที่บัญชีหลักทรัพย์ผู้รับ / Transferee’s Information`"
          :detail-page="sbse003.TAccountDetail"
          :view-mode="false"
          :validate-account="{
            validcandepwd: 'D' /* W */,
            modulename: 'STOCK',
            progname: sbse003.progname,
          }"
        />
        <section>
          <HeaderBoxLabel class="mb-0">
            รายละเอียดการทำรายการ / Request Lists of Transaction
          </HeaderBoxLabel>
          <DivRowBorder>
            <EditTransactionDetails
              v-model="transaction"
              :avg-price-params="avgpriceParams"
            />
          </DivRowBorder>
        </section>
        <LazyCommentBox v-model="form.comment" />
        <LazyWorkflowButton
          :default-btn="`Cancel`"
          product="SBA_STOCK"
          :taskname="sbse003.taskname"
          :applicationid="form.applicationid"
          @action-flow="actionFlowButtonInit"
        />
      </template>
    </LayoutProgram>
  </div>
</template>

<script lang="ts" setup>
import sbse003, { ResponseTypes } from './ts/sbse003';
import { FormTypes, EditTransDetailTypes } from './ts/sbse003_types';
import TransactionInfoBox from './components/TransactionInfoBox.vue';
import EditTransactionDetails from './components/EditTransactionDetails.vue';
import { AccessorStores } from '~/stores/Accessor';
import { AccDetail } from '~/components/utils/AccountDetail.vue';

const route = useRoute();
const fsAccessor = AccessorStores();
const formControl = useForm<FormTypes>();
const form = reactive<FormTypes>(sbse003.Form);
const transaction = reactive<EditTransDetailTypes>({} as EditTransDetailTypes);
provide('transdetail', transaction);

const actionmode = ref<string>('');
const faccountData = ref<AccDetail>({} as AccDetail);
const taccountData = ref<AccDetail>({} as AccDetail);
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
const response = ref<{ [key: string]: any }>();

const initialValues = (datas: { [key: string]: any }) => {
  console.log('# initialValues: ');
  console.log('# ✨ response: ', datas);
  // Form's
  actionmode.value = datas.actionmode;
  form.actionmode = sbse003.MODE_UPDATE;
  form.refapplicationid = datas.refapplicationid;
  form.refno = datas.refno;
  form.refdate = datas.refdate;

  // Transaction's info box
  transinfoBox.value = {
    applicationid: datas.applicationid,
    createdate: datas.createdate,
    createuser: datas.createuser,
    channel: datas.channel,
    statusname: datas.statusname,
    referno: datas.referno,
  };

  /* ข้อมูลจากฝั่ง Transferee (ผู้รับโอน) */
  taccountData.value = {
    account: datas.taccount,
    depacc: datas.tdpaccount,
    cardid: datas.tcardid,
    prefixcode: datas.ttitlecode,
    prefixdesc: datas.ttitlename,
    custname: datas.tcustname,
    custtype: datas.tcusttype,
    custcode: datas.tcustcode,
    custacct: datas.tcustacct,
    dpaccount: datas.tdpaccount,
    firstname: datas.tfirstname,
    lastname: datas.tlastname,
  } as AccDetail;

  /* ข้อมูลจากฝั่ง Transferer (ผู้โอน) */
  faccountData.value = {
    account: datas.faccount,
    depacc: datas.fdpaccount,
    cardid: datas.fcardid,
    prefixcode: datas.ftitlecode,
    prefixdesc: datas.ftitlename,
    custname: datas.fcustname,
    custtype: datas.fcusttype,
    custcode: datas.fcustcode,
    custacct: datas.fcustacct,
    dpaccount: datas.fdpaccount,
    firstname: datas.ffirstname,
    lastname: datas.flastname,
  } as AccDetail;

  // transaction.account = datas.account;
  transaction.sharecode = datas.fsharecode;
  transaction.mktcode = datas.mktcode;
  transaction.regisflag = datas.fregisflag === '1';
  transaction.fpurpose = datas.fpurpose;
  transaction.corprefer = datas.corprefer;
  transaction.avgprice = datas.avgprice;
  transaction.tradeflag = datas.tradeflag;
  transaction.xdate = datas.xdate;
  transaction.tpurpose = datas.tpurpose;
  transaction.objective = datas.objective;
  transaction.remark = datas.remark;
  transaction.unit = datas.unit;
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
  console.log('# Form: ', form);
  const validate = await formControl.validate();
  console.log('# validate: ', validate);
  if (!validate.valid) return false;

  handleSubmitData();
};

const handleSubmitData = (): void => {
  /* Validate Comment on Popup */
  console.log('# ✨ handleSubmitData');
  console.log('# formControl: ', formControl);
  const newValue = formControl.values;
  console.log('# newValue: ', newValue);

  console.log('# form: ', form);
  popup.confirmActionFlow({
    actiontype: form.actiontype,
    confirm: async function () {
      console.log('# flow confirm Action!');
      const newLists = [];
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

      console.log('# stkManageTrans | data: ', {
        progname: sbse003.progname,
        lists: newLists,
      });

      let response: { [key: string]: any } = {};
      try {
        response = await stkManageTrans(
          {
            progname: sbse003.progname,
            lists: newLists,
          },
          sbse003.MODE_UPDATE,
        );

        console.log('# response.lists: ', response.lists);
        const responseData = reactive<ResponseTypes>(sbse003.response);
        responseData.lists.push(...response.lists);

        await sbse003.responseToResultPage('edit');
      } catch (e) {}
    },
    cancel: null,
  });
};

onBeforeMount(async () => {
  console.log('onBeforeMount !!');
  if (route.query) {
    response.value = await sbse003.getInqSTKTransDetail({
      reftype: (route.query.reftype as string) || '',
      refdate: (route.query.refdate as string) || '',
      refno: (route.query.refno as string) || '',
    });
    if (response.value) {
      initialValues(response.value);
    }
  }
});
</script>

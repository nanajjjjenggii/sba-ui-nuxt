<template>
  <div>
    <LayoutProgram id="sbse003-delete-page">
      <template #title>Delete Transaction</template>
      <template #subtitle>TC</template>
      <template #body>
        <!-- ข้อมูลของใบคำร้องของอนุมัติ / Application Info -->
        <TransactionInfoBox
          :actionmode="actionmode"
          :transinfo="transinfoBox"
          :view-mode="true"
        />
        <FormDiv @submit.prevent>
          <!-- ข้อมูลเลขที่บัญชีหลักทรัพย์ผู้รับ -->
          <LazyAccountDetail
            v-model="faccountData"
            :title="`ข้อมูลเลขที่บัญชีหลักทรัพย์ผู้โอน / Transferer’s Information`"
            :detail-page="sbse003.FAccountDetail"
            :view-mode="true"
          />
          <!-- ข้อมูลเลขที่บัญชีหลักทรัพย์ผู้รับ -->
          <AccountDetail
            v-model="taccountData"
            :title="`ข้อมูลเลขที่บัญชีหลักทรัพย์ผู้รับ / Transferee’s Information`"
            :detail-page="sbse003.TAccountDetail"
            :view-mode="true"
          />
          <section class="mb-3">
            <HeaderBoxLabel class="mb-0">
              รายละเอียดของรายการ / Transaction’s Detail
            </HeaderBoxLabel>
            <DivRowBorder>
              <TransactionDetails :data-list="dataItem" />
            </DivRowBorder>
          </section>
          <LazyCommentBox v-model="form.comment" />
          <LazyWorkflowButton
            :default-btn="`Back`"
            :product="`SBA_STOCK`"
            :taskname="sbse003.taskname"
            isdelete
            :applicationid="form.applicationid"
            @action-flow="actionFlowButtonInit"
          />
        </FormDiv>
        <DeleteConfirmPopup
          v-show="showConfirmPopup"
          v-model="form.cancelreason"
          @cancel="cancelConfirmPopup()"
          @confirm="handleSubmitData()"
        />
      </template>
    </LayoutProgram>
  </div>
</template>

<script lang="ts" setup>
import sbse003, { ResponseTypes } from './ts/sbse003';
import { FormTypes, TransDetailTypes } from './ts/sbse003_types';
import TransactionInfoBox from './components/TransactionInfoBox.vue';
import { AccDetail } from '~/components/utils/AccountDetail.vue';
import { AccessorStores } from '~/stores/Accessor';
const TransactionDetails = defineAsyncComponent(
  () => import('./components/TransactionDetails.vue'),
);

const route = useRoute();
const fsAccessor = AccessorStores();
const formControl = useForm<FormTypes>();
const form = reactive<FormTypes>(sbse003.Form);

const actionmode = ref<string>('');
const faccountData = ref<AccDetail>({} as AccDetail);
const taccountData = ref<AccDetail>({} as AccDetail);
const showConfirmPopup = ref<boolean>(false);
const transinfoBox = ref({
  applicationid: '',
  createdate: '',
  createuser: '',
  channel: '',
  statusname: '',
  referno: '',
});

// TransDetailTypes
const response = ref<{ [key: string]: any }>({});
const dataItem = ref<TransDetailTypes>({} as TransDetailTypes);
const initialValues = (datas: { [key: string]: any }) => {
  console.log('# initialValues: ');
  console.log('# ✨ response: ', datas);
  // Form's
  actionmode.value = datas.actionmode;
  form.actionmode = 'D';
  form.refapplicationid = datas.refapplicationid;

  dataItem.value = datas as TransDetailTypes;

  // Transaction's info box
  transinfoBox.value = {
    applicationid: datas.refapplicationid,
    createdate: datas.createdate,
    createuser: datas.createuser,
    channel: datas.channel,
    statusname: datas.statusname,
    referno: datas.referno,
  };
  /* ข้อมูลจากฝั่ง Transferee */
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
  /* ข้อมูลจากฝั่ง Transferer */
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
  showConfirmPopup.value = true;
};

const handleSubmitData = async () => {
  /* Validate Comment on Popup */
  console.log('# ✨ handleSubmitData');
  console.log('# formControl: ', formControl);
  const validate = await formControl.validateField('cancelreason');
  console.log('# validate: ', validate);
  if (!validate.valid) return false;

  const newValue = formControl.values;
  console.log('# newValue: ', newValue);

  console.log('# form: ', form);

  const newLists = [];
  newLists.push({
    taskname: form.taskname,
    actionmode: form.actionmode,
    action: form.action,
    actiontype: form.actiontype,
    comment: form.comment,
    applicationid: '',
    reftype: form.reftype,
    refapplicationid: form.refapplicationid,
    userid: fsAccessor.getUser,
    progname: form.progname,
    channel: form.channel,
    cancelreason: form.cancelreason,
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
      sbse003.MODE_DELETE,
    );

    console.log('# response.lists: ', response.lists);
    const responseData = reactive<ResponseTypes>(sbse003.response);
    responseData.lists.push(...response.lists);

    await sbse003.responseToResultPage('delete');
  } catch (e) {}
};

const cancelConfirmPopup = () => {
  console.log('# cancelConfirmPopup!!');
  showConfirmPopup.value = false;
  form.cancelreason = '';
};

onBeforeMount(async () => {
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

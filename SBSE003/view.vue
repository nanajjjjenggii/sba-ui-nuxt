<template>
  <div>
    <Transition name="fade">
      <LayoutProgram v-if="fadeLayoutProgram" id="sbse003-view-page">
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
            <h6 class="header-label">
              รายละเอียดของรายการ / Transaction’s Detail
            </h6>
            <DivRowBorder>
              <MDBRow v-for="item of transdetails" :key="item.inputname" center>
                <MDBCol md="4">
                  <label class="col-form-label" :for="item.inputname">{{
                    item.inputlabel
                  }}</label>
                </MDBCol>
                <MDBCol md="8">
                  <span class="form-control-plaintext">{{
                    item.inputvalue
                  }}</span>
                </MDBCol>
              </MDBRow>
            </DivRowBorder>
          </section>
          <ViewPageButton @print-slip="onPrintSlip" />
        </template>
      </LayoutProgram>
    </Transition>
    <Transition name="fade">
      <PrintSlip
        :fade-confirmslip="fadeConfirmslip"
        :response="response"
        @update-fade="onClickBack"
      ></PrintSlip>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { MDBRow, MDBCol } from 'mdb-vue-ui-kit';
import sbse003 from './ts/sbse003';
import TransactionInfoBox from './components/TransactionInfoBox.vue';
import { AccDetail } from '~/components/utils/AccountDetail.vue';

interface TransactionDetails {
  inputlabel: string;
  inputname: string;
  inputvalue: string;
}

const route = useRoute();
// const formControl = useForm<FormTypes>();
// const form = reactive<FormTypes>(sbse003.Form);

const actionmode = ref<string>('');
const faccountData = ref<AccDetail>({} as AccDetail);
const taccountData = ref<AccDetail>({} as AccDetail);
const transinfoBox = ref({
  applicationid: '',
  createdate: '',
  createuser: '',
  channel: '',
  statusname: '',
  referno: '',
});
// const transdetails = reactive<TransactionDetails[]>([]);
const transdetails = ref<TransactionDetails[]>([]);
const fadeLayoutProgram = ref(true);
const fadeConfirmslip = ref(false);
// const response = ref([] as { [key: string]: any });
const response = ref<{ [key: string]: any }>();

const onPrintSlip = () => {
  fadeLayoutProgram.value = false;
  setTimeout(() => (fadeConfirmslip.value = true), 250);
};

function onClickBack(event: boolean) {
  fadeConfirmslip.value = event;
  setTimeout(() => (fadeLayoutProgram.value = true), 250);
}

const initialValues = (datas: { [key: string]: any }) => {
  console.log('# initialValues: ');
  console.log('# ✨ response: ', datas);
  // Transaction's info box
  transinfoBox.value = {
    applicationid: datas.applicationid,
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
  // Transaction's detail box
  transdetails.value.push(
    {
      inputlabel: 'หลักทรัพย์ / Symbol',
      inputname: 'fsharecode',
      inputvalue: datas.fsharecode || '-',
    },
    {
      inputlabel: 'From Purpose',
      inputname: 'fpurpose',
      inputvalue: datas.fpurpose + ' : ' + datas.fpurposedesc,
    },
    {
      inputlabel: 'Trading flag',
      inputname: 'tradeflag_detail',
      inputvalue: datas.tradeflag === 'Y' ? 'Listed' : 'Non - Listed',
    },
    {
      inputlabel: 'CA Type / Date / No.',
      inputname: 'corprefer',
      inputvalue: datas.corprefer || '-',
    },
    {
      inputlabel: 'X Date',
      inputname: 'xdate',
      inputvalue: datas.xdate || '-',
    },
    {
      inputlabel: 'To Purpose',
      inputname: 'tpurpose',
      inputvalue: datas.tpurpose + ' : ' + datas.tpurposedesc,
    },
    {
      inputlabel: 'จำนวนหุ้น / Unit',
      inputname: 'unit',
      inputvalue: getNumberFormatter(datas.unit || '0', 'n0'),
    },
    {
      inputlabel: 'Avg. Cost',
      inputname: 'avgprice',
      inputvalue: getNumberFormatter(datas.avgprice || '0', 'n6'),
    },
    {
      inputlabel: 'Object',
      inputname: 'objective',
      inputvalue: datas.objective || '-',
    },
    {
      inputlabel: 'Remarks',
      inputname: 'remark',
      inputvalue: datas.remark || '-',
    },
  );
  actionmode.value = datas.actionmode;
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

<script lang="ts">
// import ContentViewPage from './components/ContentViewPage.vue';
// import sbse003 from './ts/sbse003';
// import { FormTypes } from './ts/sbse003_types';

// const route = useRoute();
// // const formControl = useForm<FormTypes>();
// // const form = reactive<FormTypes>(sbse003.Form);
// const reftype = ref<string>((route.query.reftype as string) || '');
// const refdate = ref<string>((route.query.refdate as string) || '');
// const refno = ref<string>((route.query.refno as string) || '');

// const fadeLayoutProgram = ref(true);
// const fadeConfirmslip = ref(false);

// const onPrintSlip = () => {
//   fadeLayoutProgram.value = false;
//   setTimeout(() => (fadeConfirmslip.value = true), 250);
// };

// function onClickBack(event: boolean) {
//   fadeConfirmslip.value = event;
//   setTimeout(() => (fadeLayoutProgram.value = true), 250);
// }
</script>

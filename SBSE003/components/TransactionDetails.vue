<template>
  <section>
    <MDBRow v-for="item of transdetails" :key="item.inputname" center>
      <MDBCol md="4">
        <label class="col-form-label" :for="item.inputname">{{
          item.inputlabel
        }}</label>
      </MDBCol>
      <MDBCol md="8">
        <span class="form-control-plaintext">{{ item.inputvalue }}</span>
      </MDBCol>
    </MDBRow>
  </section>
</template>
<script lang="ts" setup>
import { MDBRow, MDBCol } from 'mdb-vue-ui-kit';
interface TransactionDetails {
  fsharecode: string;
  fpurpose: string;
  fpurposedesc: string;
  tradeflag: string;
  corprefer: string;
  xdate: string;
  tpurpose: string;
  tpurposedesc: string;
  unit: string;
  avgprice: string;
  objective: string;
  remark: string;
  cancelreason?: string;
}

interface TransactionDetailsList {
  inputlabel: string;
  inputname: string;
  inputvalue: string;
}

const props = defineProps<{
  dataList: TransactionDetails;
}>();

const transdetails = ref<TransactionDetailsList[]>([]);
const initTransDetailsBox = (datas: TransactionDetails) => {
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
      inputlabel: 'วัตถุประสงค์ / Object',
      inputname: 'objective',
      inputvalue: datas.objective || '-',
    },
    {
      inputlabel: 'หมายเหตุ / Remarks',
      inputname: 'remark',
      inputvalue: datas.remark || '-',
    },
  );
  if (datas.cancelreason) {
    transdetails.value.push({
      inputlabel: 'เหตุผลการยกเลิกรายการ / Cancel’s reason',
      inputname: 'cancelreason',
      inputvalue: datas.cancelreason || '-',
    });
  }
};
onMounted(() => {
  if (props.dataList) initTransDetailsBox(props.dataList);
});
watch(
  () => props.dataList,
  (datas: TransactionDetails) => {
    initTransDetailsBox(datas);
  },
);
</script>

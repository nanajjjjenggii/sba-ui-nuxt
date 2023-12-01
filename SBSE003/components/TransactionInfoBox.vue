<template>
  <section class="mb-3">
    <HeaderBoxLabel>{{
      !props.viewMode
        ? 'ข้อมูลของใบคำร้องขออนุมัติ / Application Info'
        : 'ข้อมูลการทำรายการ / Transaction Info'
    }}</HeaderBoxLabel>
    <DivRowBorder>
      <FormRow>
        <template v-for="item of transinfoItem" :key="item.inputname">
          <div v-if="item.visible === true" class="col-md-6 col-lg-4">
            <div class="detail-item d-flex align-items-center">
              <span class="material-icons-round me-2 fs-1">{{
                item.iconname
              }}</span>
              <div class="form-group">
                <label class="form-label" :for="item.inputname">{{
                  item.inputlabel
                }}</label>
                <span :id="item.inputname" class="form-control-plaintext">{{
                  item.inputvalue
                }}</span>
              </div>
            </div>
          </div>
        </template>
      </FormRow>
    </DivRowBorder>
  </section>
</template>

<script lang="ts" setup>
import { TransInfoValue, TransactionInfoItem } from '../ts/sbse003_types';

const props = withDefaults(
  defineProps<{
    // action: string;
    actionmode: string;
    transinfo: TransInfoValue;
    viewMode?: boolean;
  }>(),
  {
    transinfo: () => {
      return {
        applicationid: '-',
        createdate: '-',
        createuser: '-',
        channel: '-',
        statusname: '-',
        referno: '-',
      };
    },
    viewMode: false,
  },
);

const transinfoItem = reactive<TransactionInfoItem[]>([
  {
    iconname: 'article',
    inputlabel: 'เลขที่ใบคำขอฯ / Application ID',
    inputname: 'applicationid',
    inputvalue: props.transinfo.applicationid,
    visible: !props.viewMode,
  },
  {
    iconname: 'article',
    inputlabel: 'เลขที่อ้างอิงรายการ / TC Refer',
    inputname: 'referno',
    inputvalue: props.transinfo.referno,
    // visible: props.action !== 'insert',
    visible: props.actionmode !== 'I',
  },
  {
    iconname: 'event',
    inputlabel: !props.viewMode
      ? 'วัน-เวลาที่แจ้ง / Request Date'
      : 'วัน-เวลาที่สร้าง / Creation Date',
    inputname: 'createdate',
    inputvalue: props.transinfo.createdate,
    visible: true,
  },
  {
    iconname: !props.viewMode ? 'person_add' : 'how_to_reg',
    inputlabel: !props.viewMode
      ? 'ผู้ร้องขอ / Requester'
      : 'ผู้สร้างรายการ / Create User',
    inputname: 'createuser',
    inputvalue: props.transinfo.createuser,
    visible: true,
  },
  {
    iconname: 'move_to_inbox',
    inputlabel: 'ช่องทางที่ใช้ / Channel',
    inputname: 'channel',
    inputvalue: props.transinfo.channel,
    visible: true,
  },
  {
    iconname: 'fmd_good',
    inputlabel: 'สถานะใบคำขอฯ / Status',
    inputname: 'statusname',
    inputvalue: props.transinfo.statusname,
    visible: !props.viewMode,
  },
]);
watch(
  () => props.transinfo,
  (data: TransInfoValue) => {
    transinfoItem[0].inputvalue = data.applicationid;
    transinfoItem[1].inputvalue = data.referno;
    transinfoItem[2].inputvalue = data.createdate;
    transinfoItem[3].inputvalue = data.createuser;
    transinfoItem[4].inputvalue = data.channel;
    transinfoItem[5].inputvalue = data.statusname;
  },
);

watch(
  () => props.actionmode,
  (actionmode: string) => {
    transinfoItem[1].visible = actionmode !== 'I';
  },
);
</script>

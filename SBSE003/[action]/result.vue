<template>
  <div>
    <LayoutResultPage
      :response="response"
      :action-mode="action"
      :use-result-grid="useGrid"
      :grid-options="gridOptions"
    >
      <template #resultDetailDefault>
        <template v-for="item in transresult" :key="item.field">
          <div
            v-if="item.default"
            :id="`${item.field}-box`"
            class="col-sm-6 col-md-4"
          >
            <label :id="`${item.field}_label`" class="form-label">{{
              item.title
            }}</label>
            <div :id="item.field" class="form-control-plaintext">
              {{ item.value }}
            </div>
          </div>
        </template>
      </template>
      <template #resultDetailCustom>
        <template v-for="item in transresult" :key="item.field">
          <div
            v-if="!item.default"
            :id="`${item.field}-box`"
            class="col-sm-6 col-md-4"
          >
            <label :id="`${item.field}_label`" class="form-label">{{
              item.title
            }}</label>
            <div :id="item.field" class="form-control-plaintext">
              {{ item.value }}
            </div>
          </div>
        </template>
      </template>
    </LayoutResultPage>
  </div>
</template>

<script lang="ts" setup>
import sbse003 from '../ts/sbse003';
const route = useRoute();
const useGrid = ref(false);
const action: string = route.params.action as string;
const response = sbse003.response;
const record =
  response.lists.length >= 1
    ? response.lists[0]
    : {
        actiondate: '',
        taskname: '',
        faccount: '',
        fsharecode: '',
        fpurpose: '',
        unit: '',
      };

if (response.lists.length === 0) response.lists.push(record);
const transresult = [
  {
    title: 'วัน-เวลาที่แจ้ง / Request Date',
    field: 'actiondate',
    value: record.actiondate ?? '-',
    default: true,
  },
  {
    title: 'ชื่อใบงาน / Taskname',
    field: 'taskname',
    value: record.taskname ?? '-',
    default: true,
  },
  {
    title: 'เลขที่บัญชีหลักทรัพย์ / Account',
    field: 'faccount',
    value: record.faccount ?? '-',
    default: true,
  },
  {
    title: 'หลักทรัพย์ / Symbol',
    field: 'fsharecode',
    value: record.fsharecode ?? '-',
    default: false,
  },
  {
    title: 'From Purpose',
    field: 'fpurpose',
    value: record.fpurpose ?? '-',
    default: false,
  },
  {
    title: 'จำนวนหุ้น / Unit',
    field: 'unit',
    default: false,
    value: record.unit ? getNumberFormatter(record.unit ?? '0', 'n0') : '-',
  },
];

const gridOptions = {
  columns: [
    {
      title: 'Seq.',
      cell: 'runningRecord',
      className: 'text-center',
      width: 80,
    },
    {
      field: 'applicationid',
      title: 'Application ID',
      className: 'text-center',
      width: 180,
    },
    {
      field: 'fsharecode',
      title: 'Symbol',
      className: 'text-center',
      width: 100,
    },
    {
      field: 'fpurpose',
      title: 'From Purpose',
      className: 'text-center',
      width: 130,
    },
    {
      field: 'unit',
      title: 'Transfer Unit',
      cell: (h: any, _tdElement: { [key: string]: any }, props: any) => {
        return h(
          'td',
          props,
          getNumberFormatter(props.dataItem.unit ?? '0', 'n0'),
        );
      },
      className: 'text-end',
      width: 150,
    },
    {
      field: 'resultcode',
      title: 'Status',
      cell: 'statusStyle',
      width: 150,
    },
    {
      field: 'reason',
      title: 'Error Msg.',
      cell: 'reasonStyle',
      width: 250,
    },
  ],
  dataItems: response.lists,
};
</script>

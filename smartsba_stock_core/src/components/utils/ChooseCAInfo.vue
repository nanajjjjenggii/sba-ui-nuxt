<template>
  <!-- Button trigger modal -->
  <MDBBtn
    id="cainfo-button"
    color="light"
    aria-controls="cainfo-modal"
    class="px-3 text-capitalize fw-bold d-flex align-items-center border"
    @click="
      visibleModal = true;
      initialData();
    "
  >
    <span class="material-icons-round me-2">account_box</span> Choose CA
    Information
  </MDBBtn>
  <Teleport to="body">
    <CustomModal
      id="chooseCAInform_model"
      v-model="visibleModal"
      size="lg"
      centered
      scrollable
    >
      <template #title>
        รายละเอียดข่าว / Corporate Actions' Information
      </template>
      <template #body>
        <KendoGrid
          ref="grid"
          :style="{ minWidth: '750px', height: '440px' }"
          selected-field="selected"
          :columns="columns"
          :data-items="dataItems"
          :loader="loader"
          :filterable="true"
          :filter="filter"
          @filterchange="filterChange"
          @rowclick="onRowClick"
        >
          <template #headerTemplate="{ props }">
            <span class="text-center">{{ props.title }}</span>
          </template>
          <template #runningRecord="{ props }">
            <td :class="props.className">{{ props.dataIndex }}</td>
          </template>
        </KendoGrid>
      </template>
    </CustomModal>
  </Teleport>
</template>

<script setup lang="ts">
import { MDBBtn } from 'mdb-vue-ui-kit';
import {
  Grid as KendoGrid,
  GridRowClickEvent,
  GridFilterChangeEvent,
} from '@progress/kendo-vue-grid';
import {
  filterBy,
  CompositeFilterDescriptor,
} from '@progress/kendo-data-query';
import { formatDate } from '@progress/kendo-intl';

const visibleModal = ref<boolean>(false);
interface APIQuery {
  sharecode: string;
  xdate: string;
}
const property = defineProps<{
  params: APIQuery;
}>();

const emit = defineEmits<{
  (e: 'select', value: object): void;
}>();

const selectedID = ref<string>();
const dataLists = ref<Array<null | object>>([]);
const queryList = ref<Array<null | object>>([]);
const filter = ref<CompositeFilterDescriptor | undefined>();
const loader = ref<boolean>(true);
const columns: Array<object> = [
  {
    title: 'Seq.',
    minWidth: 60,
    width: 60,
    cell: 'runningRecord',
    filterable: false,
    className: 'text-center',
    headerCell: 'headerTemplate',
  },
  {
    field: 'corpdate',
    title: 'CA Date',
    filter: 'date',
    format: '{0:dd/MM/yyyy}',
    width: 120,
    className: 'text-center',
    headerCell: 'headerTemplate',
  },
  {
    field: 'corptype',
    title: 'CA Type',
    minWidth: 100,
    width: 100,
    className: 'text-center',
    headerCell: 'headerTemplate',
  },
  { field: 'corpdesc', title: 'Discription', headerCell: 'headerTemplate' },
  {
    field: 'corpno',
    title: 'CA No.',
    width: 120,
    className: 'text-center',
    headerCell: 'headerTemplate',
  },
  {
    field: 'xdate',
    title: 'X Date',
    filter: 'date',
    format: '{0:dd/MM/yyyy}',
    width: 120,
    className: 'text-center',
    headerCell: 'headerTemplate',
  },
];

const dataItems = computed(() => {
  queryList.value =
    filter.value !== undefined
      ? filterBy(dataLists.value, filter.value)
      : dataLists.value;

  return queryList.value.length > 0
    ? queryList.value.map((item: { [key: string]: any } | null): any => ({
        ...item,
        selected:
          item && Object.prototype.hasOwnProperty.call(item, 'corpid')
            ? item.corpid === selectedID.value
            : false,
      }))
    : queryList.value;
});

const onRowClick = (event: GridRowClickEvent) => {
  selectedID.value = event.dataItem.corpid;
  const dataItem: object = event && event.dataItem;
  emit('select', dataItem);
  setTimeout(() => {
    visibleModal.value = false;
  }, 300);
};

const BASE_API_STOCK = useRuntimeConfig().public.baseApiStock;
const getInqCAInfo = async () => {
  const data = {
    sharecode: property.params.sharecode, // field symbol จาก Modal Trans's Detail
    xdate: property.params.xdate, // field xdate จาก Modal Trans's Detail
  };
  const response: { [key: string]: any } | null = await getResponseBody({
    url: BASE_API_STOCK + '/inqcainfo/inquiry',
    data,
  });
  let lists: Array<object | null> = [];
  if (response != null) {
    if (response.result === 'Y' || response.resultcode === '1002') {
      lists = response.lists;
    }
  }

  if (property.params.sharecode === '7UP') {
    lists = [
      {
        corpdate: new Date(2022, 6, 1),
        corptype: 'NR',
        corpdesc: 'New Register',
        corpno: '371',
        xdate: new Date(2022, 6, 15),
        corprefer: 'N/A',
      },
      {
        corpdate: new Date(2022, 6, 1),
        corptype: 'NR',
        corpdesc: 'New Register',
        corpno: '372',
        xdate: new Date(2022, 6, 15),
        corprefer: 'N/A',
      },
      {
        corpdate: new Date(2023, 2, 1),
        corptype: 'NR',
        corpdesc: 'New Register',
        corpno: '373',
        xdate: new Date(2022, 4, 12),
        corprefer: 'N/A',
      },
      {
        corpdate: new Date(2023, 5, 1),
        corptype: 'NR',
        corpdesc: 'New Register',
        corpno: '374',
        xdate: new Date(2023, 5, 15),
        corprefer: 'N/A',
      },
    ];
  }

  return lists.length > 0
    ? lists.map((item: { [key: string]: any } | null): any => ({
        ...item,
        corpid:
          (item && item.corptype) +
          formatDate(item && item.corpdate, 'yyyyddMM') +
          (item && item.corpno),
      }))
    : lists;
};

const filterChange = (ev: GridFilterChangeEvent) => {
  loader.value = true;
  setTimeout(() => {
    filter.value = ev.filter;
    loader.value = false;
  }, 300);
};

onMounted(() => {
  initialData();
});

const initialData = async () => {
  loader.value = true;
  const resp = await getInqCAInfo();
  dataLists.value = resp;
  queryList.value = dataLists.value;
  setTimeout(() => {
    loader.value = false;
  }, 300);
};

watch(property, () => {
  selectedID.value = '';
  filter.value = undefined;
});
</script>

<template>
  <!-- Button trigger modal -->
  <MDBBtn
    id="choose-portfolio-button"
    color="light"
    aria-controls="choose-portfolio-modal"
    class="px-3 text-capitalize fw-bold d-flex align-items-center border"
    @click="
      visibleModal = true;
      setDefaultData();
    "
  >
    <span class="material-icons-round me-2">account_box</span>
    Choose From Portfolio
  </MDBBtn>
  <CustomModal id="choose-portfolio-modal" v-model="visibleModal" size="xl">
    <template #title> Portfolio </template>
    <template #body>
      <KendoGrid
        ref="grid"
        :style="{ height: '440px' }"
        selected-field="selected"
        :columns="columns"
        :data-items="dataItems"
        :row-render="cellFunction"
        :edit-field="'inEdit'"
        :loader="loader"
        @itemchange="itemChange"
      >
        <template #headerTemplate="{ props }">
          <span class="text-center">{{ props.title }}</span>
        </template>
        <template #runningRecord="{ props }">
          <td :class="props.className">{{ props.dataIndex }}</td>
        </template>
        <template #numericFormat="{ props }">
          <td :class="props.className">
            {{ getNumberFormatter(props.dataItem[props.field], 'n6') }}
          </td>
        </template>
      </KendoGrid>
    </template>
    <template #footer>
      <MDBBtn color="grey" @click="visibleModal = false">CLOSE</MDBBtn>
      <MDBBtn color="warning" @click="saveGridRecords">SAVE</MDBBtn>
    </template>
  </CustomModal>
</template>

<script setup lang="ts">
import { MDBBtn } from 'mdb-vue-ui-kit';
import { parseNumber } from '@progress/kendo-intl';
import { Grid as KendoGrid } from '@progress/kendo-vue-grid';
import {
  filterBy,
  CompositeFilterDescriptor,
} from '@progress/kendo-data-query';

import { InqSTKPortfolioParams } from '~/utils/api-stock';
const visibleModal = ref<boolean>(false);

interface InqAvgPriceParams {
  reftype: string;
  custtype: string;
  custacct: string;
  custcode: string;
}

interface InqSTKPortfolio {
  id: string;
  par: string | null;
  tsdshare: string | null;
  mus_unpaidunit: string | null;
  purpose: string | null;
  mcsm_unit: string | null;
  xchgmkt: string | null;
  regisflag: string | null;
  pendunit: string | null;
  shareid: string | null;
  sdcflag: string | null;
  mktcode: string | null;
  remainunpaidunit: string | null;
  mus_unit: string | null;
  remainunit: string | null;
  localtsdshare: string | null;
  sharecode: string | null;
  tradeflag: string | null;
  wdunit: string | null;
  depunit: string | null;
  localshare: string | null;
  account: string | null;
  board: string | null;
  availableunit: string | null;
}

const property = withDefaults(
  defineProps<{
    modelValue: object[];
    objective: string;
    stkPortfolioParams: InqSTKPortfolioParams;
    avgPriceParams: InqAvgPriceParams;
  }>(),
  {
    modelValue: () => {
      return [];
    },
  },
);

const currentInsertGrid = ref(
  property.modelValue.length > 0 ? property.modelValue : [],
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: object): void;
}>();

const getInqSTKPortfolio = async (): Promise<any[]> => {
  console.log('# getInqSTKPortfolio !!!');
  const data: InqSTKPortfolioParams = {
    account: property.stkPortfolioParams.account,
    sharecode: property.stkPortfolioParams.sharecode,
    purpose: property.stkPortfolioParams.purpose,
  };
  const response: { [key: string]: any } = await inqSTKPortfolio(data);
  console.log(' # inqstkportfolio response: ', response);

  let lists: Array<InqSTKPortfolio> = [];
  if (response != null) {
    if (response.result === 'Y' || response.resultcode === '1002') {
      lists = response.lists;
    }
  }
  return lists.length > 0
    ? lists.map((item: { [key: string]: any }): any => ({
        ...item,
        id: (item && item.sharecode) + (item && item.purpose),
        mcsm_unit: getNumericDefaultValue(item.mcsm_unit),
        mus_unit: getNumericDefaultValue(item.mus_unit),
        mus_unpaidunit: getNumericDefaultValue(item.mus_unpaidunit),
        par: getNumericDefaultValue(item.par),
        pendunit: getNumericDefaultValue(item.pendunit),
        total_useunit: getNumericDefaultValue(item.total_useunit),
        avgprice: 0,
        unit: 0,
        _mus_unit: getNumericDefaultValue(item.mus_unit),
        _total_useunit: getNumericDefaultValue(item.total_useunit),
      }))
    : lists;
};

const getNumericDefaultValue = (value: any) => {
  return value && value !== null ? parseFloat(value) : 0;
};

const initialData = ref<object[]>([]);
const dataLists = ref<object[]>([]);
let _tempDataLists = [...dataLists.value];
const queryList = ref<object[]>([]);
const filter = ref<CompositeFilterDescriptor | undefined>();
const loader = ref<boolean>(true);
const columns: object[] = [
  {
    title: 'Seq.',
    cell: 'runningRecord',
    filterable: false,
    editable: false,
    className: 'text-center',
    headerCell: 'headerTemplate',
    width: 80,
  },
  { field: 'sharecode', title: 'Symbol', editable: false, width: '100%' },
  {
    field: 'purpose',
    title: 'Purpose',
    editable: false,
    width: 80,
    className: 'text-center',
  },
  {
    field: 'mcsm_unit',
    title: 'Unit',
    cell: 'numericFormat',
    editable: false,
    width: 180,
    className: 'text-end',
  },
  {
    field: 'mus_unpaidunit',
    title: 'Unpaid Unit',
    cell: 'numericFormat',
    editable: false,
    width: 180,
    className: 'text-end',
  },
  {
    field: 'mus_unit',
    title: 'Paid Unit',
    cell: 'numericFormat',
    filter: 'numeric',
    format: '{0:n6}',
    width: 180,
    editable: false,
    className: 'text-end',
  },
  {
    field: 'total_useunit',
    title: 'Total Use Unit',
    cell: 'numericFormat',
    width: 180,
    editable: false,
    className: 'text-end',
  },
  {
    field: 'remainunpaidunit',
    title: 'Remain Unpaid Unit',
    cell: 'numericFormat',
    width: 180,
    editable: false,
    className: 'text-end',
  },
  {
    field: 'mus_unit',
    title: 'Remain Paid Unit',
    cell: 'numericFormat',
    width: 180,
    editable: false,
    className: 'text-end',
  },
  {
    field: 'depunit',
    title: 'Dep. Unit',
    cell: 'numericFormat',
    width: 180,
    editable: false,
    className: 'text-end',
  },
  {
    field: 'wdunit',
    title: 'WD. Unit',
    cell: 'numericFormat',
    width: 180,
    editable: false,
    className: 'text-end',
  },
  {
    field: 'pendunit',
    title: 'Pending Unit',
    cell: 'numericFormat',
    width: 180,
    editable: false,
    className: 'text-end',
  },
  {
    field: 'avgprice',
    hidden: true,
  },
  {
    field: 'unit',
    title: 'Transfer Unit',
    width: 180,
    editor: 'numeric',
    className: 'text-end',
  },
];

const saveGridRecords = async (): Promise<void> => {
  loader.value = true;
  const finalDataList: object[] = [];
  const activeRecord = await Promise.resolve(getCurrentGridPortfolio('all'));
  currentInsertGrid.value.forEach((item1: { [key: string]: any }) => {
    const getIndex = activeRecord.findIndex(({ id }) => id === item1.id);
    const getItem = activeRecord[getIndex];
    if (getIndex >= 0) {
      delete getItem.disabled;
      delete getItem.inEdit;
      activeRecord.splice(getIndex, 1);
    }
    finalDataList.push({ ...item1, ...getItem });
  });

  activeRecord.forEach((item) => {
    if (parseFloat(item.unit) > 0)
      finalDataList.push({ ...item, objective: property.objective });
  });

  emit('update:modelValue', finalDataList);
  loader.value = false;
  visibleModal.value = false;
};

const getCurrentGridPortfolio = (mode?: string) => {
  return dataItems.value.filter((item: { [key: string]: any }) => {
    return mode === 'update'
      ? !item.disabled && parseFloat(item.unit) > 0
      : !item.disabled;
  });
};

const dataItems = computed(() => {
  queryList.value =
    filter.value !== undefined
      ? filterBy(dataLists.value, filter.value)
      : dataLists.value;

  return queryList.value.length > 0
    ? queryList.value.map((item: { [key: string]: any } | null): any => ({
        ...item,
        fpurpose: item && item.purpose,
      }))
    : queryList.value;
});

const cellFunction = (
  h: any,
  _trElement: any,
  defaultSlots: any,
  props: any,
): any => {
  const rowsid = props.dataItem.id;
  const disabled = currentInsertGrid.value.find(
    (item: { [key: string]: any }) => item?.id === rowsid,
  );
  props.class += disabled ? ' k-disabled' : '';
  return h(
    'tr',
    {
      class: props.class,
    },
    defaultSlots,
  );
};

const setDefaultData = async () => {
  loader.value = true;
  initialData.value = await getInqSTKPortfolio();
  console.log('# initialData: ', initialData.value);

  currentInsertGrid.value =
    property.modelValue.length > 0 ? property.modelValue : [];

  console.log('# modelValue: ', currentInsertGrid);
  console.log('# property.modelValue: ', property.modelValue);

  _tempDataLists =
    initialData.value.length > 0
      ? await Promise.resolve(
          initialData.value.map(
            (item1: { [key: string]: any }): { [key: string]: any } => {
              item1.disabled = false;
              item1.inEdit = true;
              currentInsertGrid.value.forEach(
                (item2: { [key: string]: any }) => {
                  if ((item1 && item1.id) === item2.id) {
                    if (parseNumber(item2.unit) > 0) {
                      item1.unit = item2.unit;
                      item1.avgprice = item2.avgprice;
                      item1.total_useunit += item1.unit;
                      item1.mus_unit -= item1.unit;
                      item1.disabled = true;
                    }
                  }
                },
              );
              return item1;
            },
          ),
        )
      : initialData.value;
  dataLists.value = [..._tempDataLists];
  loader.value = false;
};

const getInqAvgPrice = async (
  sharecodeVal: string,
  purposeVal: string,
  unitVal: string,
) => {
  let avgprice = '0.000000';
  try {
    const response: { [key: string]: any } = await inqAvgPrice({
      reftype: property.avgPriceParams.reftype,
      custtype: property.avgPriceParams.custtype,
      custacct: property.avgPriceParams.custacct,
      custcode: property.avgPriceParams.custcode,
      sharecode: sharecodeVal,
      purpose: purposeVal,
      unit: String(unitVal),
    });
    console.log('# inqAvgPrice | response: ', response);
    if (response.result === 'Y') {
      avgprice = response.avgprice;
    }
  } catch (err: any) {
    console.error(err.message);
  }
  return avgprice;
};

const itemChange = async (event: any) => {
  loader.value = true;
  const field: string = event.field || '';
  event.dataItem[field] = event.value;
  const avgprice: string = await getInqAvgPrice(
    event.dataItem.sharecode,
    event.dataItem.purpose,
    event.dataItem.unit,
  );
  const newData = queryList.value.map((item: any) => {
    if (item.id === event.dataItem.id) {
      item[field] = event.value;
      item.total_useunit = parseInt(item._total_useunit || 0) + event.value;
      item.mus_unit = parseInt(item._mus_unit || 0) - event.value;
      item.avgprice = avgprice;
    }
    return item;
  });
  queryList.value = newData;
  loader.value = false;
};
</script>

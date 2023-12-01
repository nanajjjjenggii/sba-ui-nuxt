<template>
  <div>
    <KendoGrid
      :data-items="dataResult"
      :sortable="true"
      :reorderable="true"
      :pageable="pageable"
      :filter="filter"
      :total="total"
      :take="take"
      :skip="skip"
      :columns="columns"
      :style="{ height: '500px', margin: '0.75rem 2rem' }"
      :selected-field="'selected'"
      @rowclick="onRowClick"
      @pagechange="onPageChange"
    >
      <KendoGridToolbar>
        <span class="k-textbox k-grid-search k-display-flex searchbar">
          <KendoInput
            :style="{ width: '230px', height: 'auto', border: 'none' }"
            :placeholder="'Search'"
            :value="searchWord"
            @input="onFilter"
          ></KendoInput>
          <span class="k-input-icon"
            ><span class="k-icon k-i-search"></span
          ></span>
        </span>
      </KendoGridToolbar>
    </KendoGrid>
  </div>
</template>

<script setup lang="ts">
import { process, DataResult } from '@progress/kendo-data-query';
import {
  Grid as KendoGrid,
  GridToolbar as KendoGridToolbar,
  GridPageChangeEvent,
  GridRowClickEvent,
} from '@progress/kendo-vue-grid';
import { Input as KendoInput } from '@progress/kendo-vue-inputs';
import {
  AccountLookupList,
  AccountGridColumn,
} from '~/components/stditem/account/AccountLookup.vue';

interface AccountLookupProps {
  gridData: AccountLookupList[];
  columns: AccountGridColumn[];
}
const props = withDefaults(defineProps<AccountLookupProps>(), {});
const emit = defineEmits<{
  (e: 'grid-selected', value: AccountLookupList): void;
  (e: 'close-dialog'): void;
}>();

const pageable = ref();
const total = ref<number>(0);
const skip = ref<number>(0);
const take = ref<number>(20);
const pageSizeValue = ref<number>(20);
const pagerSizes = ref<boolean>(true);
const searchWord = ref<string>('');
const filter = ref<any>(null);
const dataResult = ref<DataResult>({ data: [] as any, total: 0 });

onMounted(() => {
  totalGrid();
  pageableSetting();
  processData(props.gridData);
});

const processData = (data: AccountLookupList[]): void => {
  dataResult.value = process(data, {
    take: take.value,
    skip: skip.value,
    filter: filter.value,
  });
};

const totalGrid = (): void => {
  total.value = dataResult.value ? dataResult.value.total : 0;
};

const pageableSetting = (): void => {
  pageable.value = {
    buttonCount: 5,
    info: true,
    pageSizes: pagerSizes.value ? ['All', 5, 10, 20] : undefined,
    previousNext: true,
    pageSizeValue,
    type: 'numeric',
  };
};

const onPageChange = (event: GridPageChangeEvent): void => {
  skip.value = event.page.skip;
  take.value =
    event.event.value === 'All' ? dataResult.value.total : event.page.take;
  pageSizeValue.value = event.event.value;
  pageableSetting();
  processData(props.gridData);
};

const onRowClick = (event: GridRowClickEvent): void => {
  searchWord.value = '';
  filter.value = null;
  processData(props.gridData);
  emit('grid-selected', event.dataItem);
  emit('close-dialog');
};

const onFilter = (event: any): void => {
  const inputValue = event.value;
  searchWord.value = inputValue;
  if (inputValue !== '') {
    const filters = [];
    let col: AccountGridColumn = {};
    for (col of props.columns) {
      const filterDetail = {
        field: col.field,
        operator: 'contains',
        value: inputValue,
      };
      filters.push(filterDetail);
    }
    filter.value = {
      logic: 'or',
      filters,
    };
  } else filter.value = null;
  processData(props.gridData);
};
</script>

<style scoped>
.searchbar {
  margin-left: auto;
  margin-right: 0;
}
</style>

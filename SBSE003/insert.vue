<template>
  <LayoutProgram>
    <template #title>Add Transaction</template>
    <template #subtitle>TC</template>
    <template #body>
      <FormDiv @submit.prevent>
        <!-- ข้อมูลเลขที่บัญชีหลักทรัพย์ผู้โอน / Transferer’s -->
        <AccountDetail
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
        <!-- ข้อมูลเลขที่บัญชีหลักทรัพย์ผู้รับ / Transferee’s -->
        <AccountDetail
          v-model="taccountData"
          :title="`ข้อมูลเลขที่บัญชีหลักทรัพย์ผู้รับ / Transferee’s Information`"
          :detail-page="sbse003.TAccountDetail"
          :view-mode="false"
          :validate-account="{
            validcandepwd: 'D' /* D */,
            modulename: 'STOCK',
            progname: sbse003.progname,
          }"
        />
        <!-- วัตถุประสงค์ และหมายเหตุ -->
        <DivRowBorder>
          <ObjectiveLookup
            id="objective"
            v-model="form.objective"
            name="objective"
            class-name="col-md-5"
          />
          <RemarksLookup
            id="remark"
            v-model="form.remark"
            name="remark"
            class-name="offset-md-1 col-md-6"
          />
        </DivRowBorder>

        <!-- รายละเอียดการทำรายการ -->
        <DivRowBorder>
          <HeaderBoxLabel :border-bottom="true"
            >รายละเอียดการทำรายการ / Request Lists of
            Transaction</HeaderBoxLabel
          >
          <div class="d-flex mb-3">
            <!-- [ + Add new ] Button -->
            <ButtonAdd
              aria-controls="newtransdetail_model"
              @click="
                setInitTransaction();
                showModalInsert = true;
              "
            >
              Add New
            </ButtonAdd>
            <NewTransaction
              v-model="showModalInsert"
              :faccount-data="faccountData"
              @add:transaction="saveNewTransaction"
            />
            <!-- [ Choose From Portfolio ] Button -->
            <ChooseFromPortfolio
              v-model="TransactionList"
              :disabled="!!faccountData.account"
              :objective="form.objective"
              :stk-portfolio-params="{
                account: faccountData.account,
              }"
              :avg-price-params="{
                reftype: sbse003.reftype,
                custtype: faccountData.custtype,
                custacct: faccountData.custacct,
                custcode: faccountData.custcode,
              }"
            />
          </div>
          <KendoGrid
            :data-items="TransactionList"
            :pageable="true"
            :page-size="10"
            :take="grid.take"
            :skip="grid.skip"
            :total="grid.total"
            :columns="grid.columns"
            :loader="grid.loader"
          >
            <template #runningRecord="{ props }">
              <td :class="props.className">{{ props.dataIndex }}</td>
            </template>
            <template #numericFormat="{ props }">
              <td :class="props.className">
                {{ getNumberFormatter(props.dataItem[props.field], 'n6') }}
              </td>
            </template>
            <template #actionRecord="{ props }">
              <td class="k-command-cell">
                <ButtonGridEdit @click="gridEditTransaction(props.dataItem)" />
                <ButtonGridDelete
                  @click="gridRemoveTransaction(props.dataItem.id)"
                />
              </td>
            </template>
          </KendoGrid>
        </DivRowBorder>

        <FormRow>
          <CommentBox v-model="form.comment" />
        </FormRow>

        <WorkflowButton
          default-btn="Cancel"
          product="SBA_STOCK"
          :taskname="sbse003.taskname"
          applicationid=""
          @action-flow="actionFlowButtonInit"
        />
      </FormDiv>
    </template>
  </LayoutProgram>
</template>

<script lang="ts" setup>
import { useForm } from 'vee-validate';

import { Grid as KendoGrid } from '@progress/kendo-vue-grid';
import NewTransaction from './components/NewTransaction.vue';
import sbse003, { ResponseTypes } from './ts/sbse003';
import { FormTypes, GridFormTypes } from './ts/sbse003_types';
import { AccDetail } from '~/components/utils/AccountDetail.vue';
import { AccessorStores } from '@/stores/Accessor';

const fsAccessor = AccessorStores();
/* Main Insert Form */
const formControl = useForm<FormTypes>();
const form = reactive<FormTypes>(sbse003.Form);
const faccountData = ref<AccDetail>({} as AccDetail);
const taccountData = ref<AccDetail>({} as AccDetail);
const transaction = reactive<GridFormTypes>({
  ...sbse003.Transdetail,
  id: '',
  rowid: '',
});
const TransactionList = ref<GridFormTypes[]>([]);
const showModalInsert = ref<boolean>(false);
provide('transdetail', transaction);

/* Add New Transaction Record */
const setInitTransaction = () => {
  console.log('# setInitTransaction');
  transaction.rowid = String(TransactionList.value.length + 1);
  transaction.tradeflag = 'Y';
  transaction.objective = form.objective;
  transaction.remark = form.remark;
};

const saveNewTransaction = (data: GridFormTypes) => {
  console.log('# saveNewTransaction');
  console.log('# data: ', data);
  const itemId = data.sharecode + data.fpurpose;
  const findItem = TransactionList.value.findIndex(
    (item: { [key: string]: any } | null) =>
      (item && item.rowid) === data.rowid,
  );
  const itemset: GridFormTypes = {
    ...data,
    id: itemId,
    transunit: data.transunit,
  } as GridFormTypes;
  console.log('# itemset: ', itemset);
  findItem < 0
    ? TransactionList.value.push(itemset)
    : (TransactionList.value[findItem] = itemset);

  console.log('# TransactionList: ', TransactionList.value);
};

/* Set Action & Action type from workflowbutton */
const actionFlowButtonInit = async (
  _step: string,
  action: string,
  actiontype: string,
): Promise<void> => {
  console.log('# actionFlowButtonInit ');
  form.action = action;
  form.actiontype = actiontype;
  console.log('# form: ', form);

  const validate = await formControl.validate();
  if (validate.valid) handleSubmitDatas();
};

const handleSubmitDatas = async (): Promise<void> => {
  console.log('# handleSubmitDatas | data: ', {
    progname: sbse003.progname,
    lists: await serializeFormDatas(TransactionList.value),
  });
  await popup.confirmActionFlow({
    actiontype: form.actiontype,
    confirm: async function () {
      try {
        const response: { [key: string]: any } = await stkManageTrans(
          {
            progname: sbse003.progname,
            lists: await serializeFormDatas(TransactionList.value),
          },
          sbse003.MODE_INSERT,
        );
        console.log('# response: ', response);
        const responseData = reactive<ResponseTypes>(sbse003.response);
        responseData.lists.push(...response.lists);
        console.log('# response.lists: ', response.lists);

        await sbse003.responseToResultPage('insert');
      } catch (error: any) {
        console.error(error);
        throw new Error(error);
      }
    },
    cancel: function () {
      console.log('# flow cancel Action!');
    },
  });
};

const serializeFormDatas = async (dataList: {
  [key: string]: any;
}): Promise<FormTypes[]> => {
  const newArr: FormTypes[] = [];
  // const faccount = faccountData.value;
  const taccount = taccountData.value;
  await dataList.forEach((item: { [key: string]: any }) => {
    console.log('# item: ', item);
    console.log('# faccount✨: ', faccountData.value);
    console.log('# taccount✨: ', taccountData.value);
    newArr.push({
      ...form,
      actionmode: sbse003.MODE_INSERT /* Strict */,
      applicationid: '',
      refapplicationid: '',
      sharecode: item.sharecode,
      purpose: item.tpurpose,
      sharecode2: item.sharecode,
      purpose2: item.fpurpose,
      /* ค่าจาก Transferee */
      custtype: taccount.custtype,
      custacct: taccount.custacct,
      custcode: taccount.custcode,
      account: taccount.account,
      dpaccount: taccount.dpaccount,
      title: taccount.prefixdesc,
      /* ค่าจาก Transferer */
      custtype2: faccountData.value.custtype,
      custacct2: faccountData.value.custacct,
      custcode2: faccountData.value.custcode,
      account2: faccountData.value.account,
      dpaccount2: faccountData.value.dpaccount,
      title2: faccountData.value.prefixdesc,
      /* ค่าจาก Transaction Details */
      unit: item.unit,
      avgprice: item.avgprice,
      xdate: item.xdate || '',
      tradeflag: item.tradeflag,
      corptxndt: item.corpdate,
      corptxntype: item.corptype,
      corptxnno: item.corpno,
      objective: item.objective,
      remark: item.remark,
      userid: fsAccessor.getUser,
    } as FormTypes);
  });
  return newArr;
};

/* Grid Initialization */
const gridEditTransaction = (dataItem: GridFormTypes): void => {
  console.log('# gridEditTransaction!!');
  console.log('# dataItem: ', dataItem);
  transaction.account = dataItem.account;
  transaction.sharecode = dataItem.sharecode;
  transaction.mktcode = dataItem.mktcode;
  transaction.regisflag = dataItem.regisflag;
  transaction.fpurpose = dataItem.fpurpose;
  transaction.corprefer = dataItem.corprefer;
  transaction.xdate = dataItem.xdate;
  transaction.avgprice = dataItem.avgprice;
  transaction.tradeflag = dataItem.tradeflag;
  transaction.tpurpose = dataItem.tpurpose;
  transaction.objective = dataItem.objective;
  transaction.remark = dataItem.remark;
  transaction.unit = dataItem.unit;
  transaction.availableunit = dataItem.availableunit;
  transaction.transunit = dataItem.transunit;
  showModalInsert.value = true;
};

const gridRemoveTransaction = (rowid: number): void => {
  TransactionList.value = TransactionList.value.filter(
    (item: { [key: string]: any } | null) => (item && item.id) !== rowid,
  );
};

const grid = reactive({
  total: computed(() => {
    return TransactionList.value.length;
  }),
  loader: false,
  pageable: {
    buttonCount: 5,
    previousNext: true,
    pageSizes: [10, 15, 20, 'all'],
    pageSizeValue: 10,
    info: true,
  },
  skip: 0,
  take: 10,
  columns: [
    {
      field: 'index',
      editable: false,
      hidden: true,
    },
    {
      field: 'fromport',
      editable: false,
      hidden: true,
    },
    {
      title: 'Seq.',
      width: 70,
      className: 'text-center',
      cell: 'runningRecord',
    },
    // {
    //   field: 'unit',
    //   editable: false,
    //   hidden: true,
    // },
    {
      field: 'sharecode',
      title: 'Symbol',
      minWidth: 100,
      className: 'text-center',
    },
    {
      field: 'fpurpose',
      title: 'From Purpose',
      minWidth: 120,
      className: 'text-center',
    },
    {
      field: 'transunit',
      title: 'Transfer Unit',
      cell: 'numericFormat',
      minWidth: 180,
      className: 'text-end',
    },
    {
      field: 'avgprice',
      title: 'Avg. Cost',
      cell: 'numericFormat',
      minWidth: 180,
      className: 'text-end',
    },
    { field: 'objective', title: 'Objective', minWidth: 200 },
    { title: 'Action', cell: 'actionRecord', minWidth: 230 },
  ],
});

watch(
  () => taccountData.value.account,
  (account: string) => {
    console.log('👁️ taccountData | account: ', account);
    transaction.account = account;
    TransactionList.value = [];
  },
);
</script>

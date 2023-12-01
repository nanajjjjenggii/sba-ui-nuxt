<template>
  <LayoutProgram>
    <template #title>รายละเอียดการทำรายการ / Transaction Detail</template>
    <template #body>
      <DivRowBorder class="px-3 py-4">
        <h4 id="resultmsg" class="px-1">
          <svg
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
            :class="`fs-3 bi ${
              responseResult === 'Y'
                ? 'bi-check-circle-fill'
                : 'bi-x-circle-fill'
            }`"
            :fill="responseResult === 'Y' ? successColor : failedColor"
          >
            <path
              v-if="responseResult === 'Y'"
              fill-rule="evenodd"
              d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"
            ></path>
            <path
              v-else
              fill-rule="evenodd"
              d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.146-3.146a.5.5 0 0 0-.708-.708L8 7.293 4.854 4.146a.5.5 0 1 0-.708.708L7.293 8l-3.147 3.146a.5.5 0 0 0 .708.708L8 8.707l3.146 3.147a.5.5 0 0 0 .708-.708L8.707 8l3.147-3.146z"
            ></path>
          </svg>
          <span class="ms-2">{{
            getTitleResultLabel(responseTitleResult)
          }}</span>
        </h4>
        <div class="row g-2">
          <slot name="resultDetailDefault"></slot>
        </div>
        <div class="row g-2 mt-0">
          <slot v-if="!multiResult" name="resultDetailCustom"></slot>
          <template v-else>
            <div
              v-for="item in responseSummary"
              :id="`${item.field}-box`"
              :key="item.field"
              class="col-sm-6 col-md-4"
            >
              <label
                :id="`${item.field}_label`"
                :class="`form-label ${item.classname}`"
                >{{ item.label }}</label
              >
              <div :id="item.field" class="form-control-plaintext">
                {{ getNumberFormatter(String(item.value), 'n') }} Transaction
                (S)
              </div>
            </div>
          </template>
        </div>
      </DivRowBorder>
      <DivRowBorder v-if="multiResult" class="p-4">
        <headerBoxLabel>Lists of Transaction</headerBoxLabel>
        <KendoGrid v-if="gridOptions" v-bind="gridOptions">
          <template #runningRecord="{ props }">
            <td :class="props.className">{{ props.dataIndex }}</td>
          </template>
          <template #statusStyle="{ props }">
            <td
              :class="
                getStatusClass(props.dataItem.result, props.dataItem.resultcode)
              "
            >
              {{
                getStatusText(props.dataItem.result, props.dataItem.resultcode)
              }}
            </td>
          </template>
          <template #reasonStyle="{ props }">
            <td
              :class="
                getStatusClass(props.dataItem.result, props.dataItem.resultcode)
              "
            >
              {{ props.dataItem.errmsg }}
            </td>
          </template>
        </KendoGrid>
        <slot v-else name="resultGridDetail"></slot>
      </DivRowBorder>
      <div v-else id="result-reason" class="my-3">
        <div
          class="reason-box"
          :style="`color: ${
            responseResult === 'Y' ? successColor : failedColor
          };`"
        >
          {{ getTransdetail[0].reason }}
        </div>
      </div>
      <div id="result-button" class="row row-btn">
        <template v-if="responseResult === 'Y'">
          <div v-if="actionMode === 'editdraft'">
            <ButtonClose />
          </div>
          <div v-else-if="actionMode === 'approve'">
            <ButtonClose>Ok</ButtonClose>
          </div>
          <div
            v-else-if="actionMode !== 'editdraft' && actionMode !== 'approve'"
          >
            <button id="return-home-button" role="button" class="btn btn-reset">
              Return Home
            </button>
            <button
              id="continued-add-button"
              role="button"
              class="btn btn-reset"
            >
              Continue Add
            </button>
          </div>
        </template>
        <template v-else>
          <div class="d-flex justify-content-between">
            <div>
              <ButtonBack class="btn-search" />
              <ButtonCancel />
            </div>
            <MDBBtn
              id="reportIssueButton"
              color="danger"
              @click="onClickReportAnIssue"
            >
              Report an Issue
            </MDBBtn>
          </div>
        </template>
      </div>
      <div class="report">
        <ReportAnIssue
          v-model="showReport"
          :faccount-data="{
            reftype: property.response.lists[0].reftype,
            actionMode: property.actionMode,
          }"
        ></ReportAnIssue>
      </div>
    </template>
  </LayoutProgram>
</template>

<script lang="ts" setup>
import { MDBBtn } from 'mdb-vue-ui-kit';
import { Grid as KendoGrid } from '@progress/kendo-vue-grid';
import LabelConfig from '@/json/titleresult.json';

const showReport = ref(false);
const failedColor = 'rgb(219, 82, 76)';
const successColor = 'rgb(72, 153, 78)';

const property = withDefaults(
  defineProps<{
    response: { [key: string]: any };
    actionMode: string;
    // // transResultBox: TransactionResultBox[];
    useResultGrid?: boolean;
    gridOptions?: { [key: string]: any };
    // useLists?: boolean;
  }>(),
  {
    useResultGrid: false,
    gridOptions: () => {
      return [
        {
          columns: [],
          dataItems: [],
        },
      ];
    },
  },
);

const useLists = !!Object.getOwnPropertyDescriptor(property.response, 'lists');

const responseLists: { [key: string]: any }[] = useLists
  ? property.response.lists
  : [{ ...property.response }];
const multiResult = responseLists.length > 1;
const responseResult = responseLists.every(
  (item: { [key: string]: any }) => item.result === 'N',
)
  ? 'N'
  : 'Y';

const getTransdetail = computed(() => {
  return responseLists.map((item: { [key: string]: any }): any => ({
    ...item,
    value: responseLists[0][item.field],
  }));
});

type SummaryResult = {
  label: string;
  field: string;
  classname: string;
  value: number;
};

const getSummaryTransResult = (): SummaryResult[] => {
  const label = ['Success', 'Fail', 'On process'];
  const field = ['success', 'fail', 'onprocess'];
  const classes = ['text-success', 'text-danger', 'text-warning'];
  const resultArr: Array<SummaryResult | never> = [];
  field.forEach((value: string, index: number) => {
    const newArr: SummaryResult = {
      label: label[index],
      field: value,
      classname: classes[index],
      value: responseLists.filter((item: { [key: string]: any }) => {
        if (value === 'success') {
          return item.result === 'Y';
        } else if (value === 'onprocess') {
          return item.result === 'Y' && item.resultcode === '4031';
        } else {
          return item.result === 'N';
        }
      }).length,
    };
    resultArr.push(newArr);
  });
  return resultArr;
};

const responseSummary: SummaryResult[] = multiResult
  ? getSummaryTransResult()
  : [];
const responseTitleResult: string =
  responseResult === 'N' && multiResult
    ? '00'
    : responseLists[0].titleresult ?? '00'; // use with fsMessage

const getStatusText = (result: string, resultcode: string) => {
  let classname = 'Fail';
  if (result === 'Y') {
    if (resultcode === '4031') {
      classname = 'On Process';
    } else {
      classname = 'Success';
    }
  }
  return classname;
};

const getStatusClass = (result: string, resultcode: string) => {
  let classname = 'text-danger';
  if (result === 'Y') {
    if (resultcode === '4031') {
      classname = 'text-warning';
    } else {
      classname = 'text-success';
    }
  }
  return classname;
};

function onClickReportAnIssue() {
  showReport.value = true;
}

const getTitleResultLabel = (name: string, lang = 'EN'): string => {
  let titleresult = '';
  try {
    const labelObject: { name: string; value: string }[] =
      LabelConfig.find((item: { language: string }) => item.language === lang)
        ?.label ?? [];
    titleresult =
      labelObject.find((item: { name: string }) => item.name === name)?.value ||
      ('' as string);
  } catch (err) {
    console.error(err);
  }
  return titleresult;
};
</script>

<style lang="scss" scoped>
.reason-box {
  margin: 0.65rem 0;
  padding: 0.75rem 1rem;
  background: #e8e8e8;
  border: 0;
  border-radius: 0.25rem;
}

#reportIssueButton {
  min-width: 180px;
}
</style>

<template>
  <FormRow
    id="workflow-button"
    class="utils-workflow-btn"
    :class="{
      [className]: className,
    }"
  >
    <div
      v-for="(list, index) in btnPositionList"
      :key="index"
      :class="contentSizeCalculate(index, list[0].position)"
    >
      <template v-if="list.length > 0">
        <button
          v-if="index == 0 && defaultBtn"
          :id="`${defaultBtn}`"
          type="button"
          class="btn btn-grey waves-effect ripple-surface"
          @click="defaultButtonFlow(defaultBtn)"
        >
          {{ defaultBtn }}
        </button>
        <template v-for="(item, index2) in list" :key="index2">
          <button
            v-if="item.show"
            :id="`${item.idname}`"
            type="button"
            :class="`${item.idname} btn ${item.colorclass} waves-effect ripple-surface`"
            @click="
              emit('action-flow', item.step, item.action, item.actiontype)
            "
          >
            <i :class="`${item.iconclass} me-2`"></i>
            {{ item.actionname }}
          </button>
        </template>
      </template>
    </div>
  </FormRow>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

console.log('========== [START] WORKFLOW-BUTTON ==========');
interface WorkflowButtonProps {
  applicationid?: string;
  className?: string;
  defaultBtn?: string | false;

  isdelete?: boolean;
  product: string;
  taskname: string;
}

interface ResultListType {
  position: string;
  step: string;
  actionname: string;
  action: string;
  colorclass: string;
  actiontype: string;
  iconclass: string;
  idname: string;
  show: boolean;
}

const props = withDefaults(defineProps<WorkflowButtonProps>(), {
  className: '',
  applicationid: '',
  useBackBtn: false,
  useCloseBtn: false,
  useCancelBtn: false,
  defaultBtn: false,
  isdelete: false,
});

let btnLeftCount = 0;
let btnCenterCount = 0;
let btnRightCount = 0;
let dataList: any[] = [];
const router = useRouter();
const btnPositionList: Ref<ResultListType[][]> = ref([]);
const btnRatio: { [key: string]: number } = reactive({
  left: 0,
  center: 0,
  right: 0,
});

const getWorkflowButtonList = async (): Promise<Array<null | object>> => {
  try {
    const params: {
      product: string;
      taskname: string;
      applicationid: string;
      query: string;
    } = {
      product: props.product || '',
      taskname: props.taskname || '',
      applicationid: props.applicationid || '',
      query: props.applicationid !== '' ? 'appid' : 'taskname',
    };

    const { data } = await useFetch('/api/workflowbutton', {
      method: 'POST',
      body: params,
    });

    const response: { [key: string]: any } = data;
    return response.value ? response.value.result_list : [];
  } catch (error) {
    console.error(error);
    throw new Error(error as string);
  }
};

const getButtonByPosition = (position: string): ResultListType[] => {
  return dataList.filter((item) => position === item.position);
};

const contentSizeCalculate = (_current: number, position: string): string => {
  const ratio: number = btnRatio[position];
  let classes = 'mb-3 ';
  if (ratio > 0 && ratio < 20) {
    classes += 'col-lg-2';
  } else if (ratio < 40) {
    classes += 'col-lg-4';
  } else if (ratio < 60) {
    classes += 'col-lg-6';
  } else if (ratio < 80) {
    classes += 'col-lg-8';
  } else if (ratio < 100) {
    classes += 'col-lg-10';
  } else if (ratio === 100) {
    classes += 'col-lg-12';
  }
  return position !== 'left' ? 'text-' + position + ' ' + classes : classes;
};

const defaultButtonFlow = (btn: string | boolean): void => {
  console.log(`# default '${btn}' ButtonFlow!!`);
  switch (btn) {
    case 'Back':
      router.back();
      break;
    case 'Cancel':
      goToFirstRoute();
      break;
    case 'Close':
      window.close();
      break;
    default:
      break;
  }
};

const goToFirstRoute = async () => {
  await router.isReady();
  const routes = router.getRoutes();
  if (routes.length > 0) {
    const firstRoute = routes[0];
    router.push(firstRoute.path);
  }
};

const emit = defineEmits<{
  (e: 'action-flow', step: string, action: string, actiontype: string): void;
}>();

onBeforeMount(async () => {
  const response = await getWorkflowButtonList();
  if (response.length > 0) dataList = response;

  for (const btn of dataList) {
    btn.show = true;
    if (props.isdelete && btn.position === 'left') {
      btn.show = false;
    }
    if (props.isdelete && btn.position === 'right') {
      btn.colorclass = 'btn-red';
    }
  }

  let btnTotal = 0;
  if (dataList) {
    btnTotal = props.defaultBtn ? dataList.length + 1 : dataList.length;

    const leftList = getButtonByPosition('left');
    const centerList = getButtonByPosition('center');
    const rightList = getButtonByPosition('right');

    btnLeftCount = props.defaultBtn ? leftList.length + 1 : leftList.length;
    btnCenterCount = centerList.length;
    btnRightCount = rightList.length;
    if (btnLeftCount > 0) btnPositionList.value.push(leftList);
    if (btnCenterCount > 0) btnPositionList.value.push(centerList);
    if (btnRightCount > 0) btnPositionList.value.push(rightList);
  }
  btnRatio.left = (btnLeftCount * 100) / btnTotal;
  btnRatio.center = (btnCenterCount * 100) / btnTotal;
  btnRatio.right = (btnRightCount * 100) / btnTotal;
});
console.log('========== [END] WORKFLOW-BUTTON ==========');
</script>
<style scoped>
.btn-green {
  color: #fff;
  background-color: #388e3c !important;
}
.btn-orange {
  color: #fff;
  background-color: #ffa000 !important;
}
.btn-red {
  color: #fff;
  background-color: #d32f2f !important;
}
.text-right {
  text-align: right !important;
}
</style>

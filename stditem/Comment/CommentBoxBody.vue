<template>
  <div
    :id="`${id}-body`"
    class="commentbox-accordion-body accordion-collapse"
    :aria-labelledby="`${id}-heading`"
    :data-mdb-parent="`#${id}`"
  >
    <FormRow>
      <FormLabel
        :for="id"
        class="col-form-label"
        :class="{
          'col-sm-12 col-md-6': !popup,
        }"
        >ต้นแบบข้อคิดเห็น / Comment Template</FormLabel
      >
      <MDBCol :md="!popup ? '6' : '12'">
        <KendoComboBox
          :id="`${id}-lookup`"
          v-model="templateValue"
          :data-items="dataList"
          :clear-button="false"
          :text-field="`chkdescriptionText`"
          :value-field="`chkdescription`"
          :value-primitive="true"
          :placeholder="`Select Template...`"
          @change="onTemplateChange"
        />
      </MDBCol>
    </FormRow>
    <div class="mb-3 d-flex">
      <div
        :class="{
          'd-block': popup,
          'd-none d-md-block': !popup,
        }"
      >
        <UserProfileImage />
      </div>
      <div class="w-100">
        <FormTextarea
          v-if="useCommentField"
          :id="id"
          v-model="commentValue"
          :input-name="name"
          :rows="3"
          :placeholder="`Write a comment...`"
          :rules="
            required ? $Yup.string().required().label('Comment') : undefined
          "
          no-label
          :required="required"
          @input="onInput($event)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { MDBCol } from 'mdb-vue-ui-kit';
import { ComboBox as KendoComboBox } from '@progress/kendo-vue-dropdowns';
interface CommentBody {
  id: string;
  name: string;
  modelValue: string;
  required?: boolean;
  popup?: boolean;
  usefield?: boolean;
}

type TchecklistResponse = {
  chkdescription: string;
  chkid: string;
  chkseqno: string;
  roleid: string;
};

interface TchecklistItem extends TchecklistResponse {
  chkdescriptionText: string;
}

const props = withDefaults(defineProps<CommentBody>(), {
  required: false,
  popup: false,
  usefield: false,
});
const templateValue = ref<string>();
const commentValue = ref<string>(props.modelValue);
const useCommentField = ref<boolean>(props.usefield);
const dataList = ref<TchecklistItem[]>([]);
const getLookupCommentlist = async (): Promise<Array<TchecklistResponse>> => {
  let lists: Array<TchecklistResponse> = [];
  try {
    const response: { [key: string]: any } = await getResponseBody({
      url: useRuntimeConfig().public.baseApiUtil + '/lookuptchecklist/collect',
    });

    if (response) {
      if (response.result === 'Y' || response.resultcode === '1002') {
        lists = response.lists;
      }
    }
  } catch (error) {
    console.log('# error, ', error);
    console.error(error);
  }
  return lists;
};

const emit = defineEmits(['update:modelValue']);
const onTemplateChange = (event: any) => {
  console.log('# onTemplateChange');
  console.log('# event: ', event);
  const template = event.value;
  let value = commentValue.value;
  const newLine = value ? '\n' : '';
  value += template && template !== '' ? newLine + template : '';
  templateValue.value = '';

  emit('update:modelValue', value);
};

onBeforeMount(async () => {
  const response = await getLookupCommentlist();
  if (response.length > 0)
    dataList.value = response.map(
      (item: TchecklistResponse): TchecklistItem => {
        return { ...item, chkdescriptionText: item.chkdescription };
      },
    );
});

watch(
  () => props.modelValue,
  (value: string) => {
    commentValue.value = value;
  },
);

watch(
  () => props.usefield,
  (value = true) => {
    useCommentField.value = value;
  },
);

const onInput = (event: any) => {
  console.log('# onInput');
  console.log('# event: ', event);
  const value: string = event?.value;
  console.log('# value: ', value);
  // commentValue.value = commentValue.value + value;
  emit('update:modelValue', value);
};
</script>

<style scoped lang="scss">
.commentbox-accordion-body :deep(textarea) {
  min-height: 86.58px !important;
}
</style>

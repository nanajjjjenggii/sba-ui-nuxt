<template>
  <MDBAccordion v-model="activeItem" :class="`mb-3 ${className}`">
    <MDBAccordionItem
      :collapse-id="`${id}-commentbox-accordion`"
      class="w-100"
      header-title="ระบุข้อคิดเห็น / Write a comment"
      header-classes="commentbox-accordion-btn"
      @click.prevent
    >
      <CommentBoxBody
        :id="id"
        v-model="commentValue"
        :name="name"
        :class="`w-100`"
        :required="required"
        :usefield="true"
      />
    </MDBAccordionItem>
  </MDBAccordion>
</template>

<script lang="ts" setup>
import { MDBAccordion, MDBAccordionItem } from 'mdb-vue-ui-kit';
import { CommentLists } from './CommentTypes';
interface CommentBoxProps {
  id?: string;
  name?: string;
  className?: string;
  modelValue: string;
  commentlist?: CommentLists[];
  required?: boolean;
}

type CommentItem = {
  finishdate: string;
  rolename: string;
  owner: string;
  roleid: string;
  usercomment: string;
  action: string;
  ownername: string;
  currentstep: string;
  startdate: string;
  seq: number;
};

const props = withDefaults(defineProps<CommentBoxProps>(), {
  id: 'comment',
  name: 'comment',
  className: '',
  commentlist: () => {
    return [];
  },
  required: false,
});

const getCommentValue = (): string => {
  let newValue = '';
  const value: any =
    props.commentlist.length > 0
      ? props.commentlist
      : props.modelValue.toString;
  if (value && typeof value !== 'string') {
    const getItem: CommentItem | undefined = props.commentlist.find(
      (item: CommentItem) => item.currentstep === '1',
    );
    if (getItem) {
      newValue = getItem.usercomment;
    }
  }
  return newValue || '';
};

const emit = defineEmits(['update:modelValue']);
const activeItem = ref<string>('');
const commentValue = ref<string>('');
watch(commentValue, (datas): void => {
  emit('update:modelValue', datas);
});

onMounted(() => {
  const button = document.querySelector(
    `[aria-controls=${
      props.id ? props.id + '-commentbox' : 'commentbox'
    }-accordion]`,
  );
  const span = document.createElement('span');
  span.classList.add('material-icons-round', 'me-2');
  span.innerText = 'comment';
  button?.prepend(span);
  if (props.commentlist) initByCommentList(props.commentlist);
});

watch(
  () => props.commentlist,
  (value: Array<CommentLists>) => {
    initByCommentList(value);
  },
);

const initByCommentList = (commentlist: Array<CommentLists>): void => {
  const commentFromList = getCommentValue();
  commentValue.value =
    commentlist.length > 0 ? commentFromList : props.modelValue;
  if (commentFromList) {
    emit('update:modelValue', commentFromList);
  }
  activeItem.value =
    commentFromList !== '' ? `${props.id}-commentbox-accordion` : '';
};
</script>

<style lang="scss" scoped>
.accordion-item :deep(.commentbox-accordion-btn > .accordion-button) {
  --mdb-accordion-btn-padding-y: 0.625rem;
  --mdb-accordion-btn-color: #5a738e;
  --mdb-accordion-btn-bg: #f2f5f7;
  --mdb-accordion-active-color: #375777;
  --mdb-accordion-active-bg: #f2f5f7;
  --mdb-accordion-btn-icon: url('data:image/svg+xml,%3csvg xmlns="http://www.w3.org/2000/svg" viewBox="2.5 2.5 20 20" fill="none"%3e %3cpolyline xmlns="http://www.w3.org/2000/svg" fill="none" id="Down" points="5 8.5 12 15.5 19 8.5" stroke="rgb(55, 87, 119)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/%3e %3c/svg%3e');
  --mdb-accordion-btn-active-icon: url('data:image/svg+xml,%3csvg xmlns="http://www.w3.org/2000/svg" viewBox="2.5 1.5 20 20" fill="none"%3e %3cpolyline xmlns="http://www.w3.org/2000/svg" fill="none" id="Down" points="5 8.5 12 15.5 19 8.5" stroke="rgb(90, 115, 142)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/%3e %3c/svg%3e');
}
</style>

<template>
  <MDBAccordion
    v-if="dataItems.length > 0"
    :id="boxid"
    v-model="activeItem"
    :class="`mb-3 ${className}`"
    @click.once="visible = true"
  >
    <MDBAccordionItem
      :collapse-id="`${boxid}box-accordion`"
      header-title="ข้อคิดเห็นก่อนหน้านี้ / Previous comments"
      header-classes="prevcommentbox-accordion-btn"
      @click.prevent
    >
      <div
        :id="`${boxid}-body`"
        class="accordion-collapse"
        :aria-labelledby="`${boxid}-heading`"
        :data-mdb-parent="`#${boxid}`"
      >
        <template v-for="(item, index) in dataItems" :key="item.seq">
          <MDBAccordion v-model="activeItemLists[index].active" flush stay-open>
            <div class="d-flex justify-content-between">
              <div
                class="bg-dark bg-opacity-10 rounded-2 text-dark text-wrap px-2"
              >
                Role ID : <span>{{ item.rolename }}</span
                ><span>{{ item.ownername }}</span>
              </div>
              <div>{{ item.startdate }}</div>
            </div>

            <MDBAccordionItem
              header-title="ข้อคิดเห็น / comment"
              :collapse-id="`comment-id-${item.seq}`"
            >
              <div class="w-100">
                <div class="mb-3 d-flex">
                  <div class="d-none d-md-block">
                    <UserProfileImage />
                  </div>
                  <div class="w-100">
                    {{ item.usercomment }}
                  </div>
                </div>
              </div>
            </MDBAccordionItem>
          </MDBAccordion>
        </template>
      </div>
    </MDBAccordionItem>
  </MDBAccordion>
</template>

<script lang="ts">
import { MDBAccordion, MDBAccordionItem } from 'mdb-vue-ui-kit';
import { CommentLists } from './CommentTypes';
</script>
<script lang="ts" setup>
interface PrevCommentBoxProps {
  className?: string;
  commentlist: CommentLists[];
}

const props = withDefaults(defineProps<PrevCommentBoxProps>(), {
  className: '',
});

const boxid = 'prevcomment';
const visible = ref(false);
const dataItems = computed(() => {
  return (
    props.commentlist?.filter(
      (item: { [key: string]: any }) => item.currentstep === '0',
    ) ?? []
  );
});
const activeItem = ref<string>(`${boxid}box-accordion`);
const activeItemLists = computed(() => {
  const newArr = reactive<Array<{ active: string } | never>>([]);
  props.commentlist
    .filter((item: { currentstep: string }) => item.currentstep === '0')
    .forEach((item: { [key: string]: any }) =>
      newArr.push({ active: `comment-id-${item.seq}` }),
    );
  return newArr;
});

onMounted(() => {
  console.log('# PrevCommentBox | onMounted 🔥');
  activeItem.value = '';
  const button = document.querySelector(
    `[aria-controls=${boxid}box-accordion]`,
  );
  const span = document.createElement('span');
  span.classList.add('material-icons-round', 'me-2');
  span.innerText = 'textsms';
  button?.prepend(span);
});
</script>

<style lang="scss" scoped>
.accordion-item :deep(.prevcommentbox-accordion-btn > .accordion-button) {
  --mdb-accordion-btn-padding-y: 0.625rem;
  --mdb-accordion-btn-color: #5a738e;
  --mdb-accordion-btn-bg: #f2f5f7;
  --mdb-accordion-active-color: #375777;
  --mdb-accordion-active-bg: #f2f5f7;
  --mdb-accordion-btn-icon: url('data:image/svg+xml,%3csvg xmlns="http://www.w3.org/2000/svg" viewBox="2.5 2.5 20 20" fill="none"%3e %3cpolyline xmlns="http://www.w3.org/2000/svg" fill="none" id="Down" points="5 8.5 12 15.5 19 8.5" stroke="rgb(55, 87, 119)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/%3e %3c/svg%3e');
  --mdb-accordion-btn-active-icon: url('data:image/svg+xml,%3csvg xmlns="http://www.w3.org/2000/svg" viewBox="2.5 1.5 20 20" fill="none"%3e %3cpolyline xmlns="http://www.w3.org/2000/svg" fill="none" id="Down" points="5 8.5 12 15.5 19 8.5" stroke="rgb(90, 115, 142)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/%3e %3c/svg%3e');
}
</style>

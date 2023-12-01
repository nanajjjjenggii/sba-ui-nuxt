<template>
  <div class="program">
    <h4><slot name="headprogram">Stock Management</slot></h4>
    <!-- <div class="text-center p-4 op-50">
      Current route: <code>{{ $route.path }}</code>
    </div> -->
    <div class="card">
      <div class="program-header card-header">
        <HeaderProgram
          :enable-about-version="props.enableAboutVersion"
          :enable-report-issue="props.enableReportIssue"
        >
          <template #title><slot name="title"></slot></template>
          <template #subtitle><slot name="subtitle"></slot></template>
        </HeaderProgram>
      </div>
      <div class="program-body card-body">
        <!-- <slot name="title"></slot> -->
        <!-- title: {{ title }} $slots: {{ $slots }} slot: {{ slots }} $slot: {{ this.$slot }} -->
        <slot name="body"> You Can Customize it!! ✂️ </slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// const head: Ref<string> = ref('');
// const title: Ref<string> = ref('');
// const subtitle: Ref<string> = ref('');
interface LayoutProgram {
  enableAboutVersion?: boolean;
  enableReportIssue?: boolean;
}

const props = withDefaults(defineProps<LayoutProgram>(), {
  enableAboutVersion: true,
  enableReportIssue: false,
});
console.log('# props: ', props);

// const slots = useSlots();
// console.log('# slots: ', slots);
// head.value = slots.head ? slots.head()[0].children : '';
// title.value = slots.title ? slots.title()[0].children : '';
// subtitle.value = slots.subtitle ? slots.subtitle()[0].children : '';

// onMounted(() => {
//   console.log("🔥:", slots);
// })
</script>
<style></style>
<style scoped>
.program-header {
  background-color: #5e6678;
  color: #ffffff;
  font-size: 18px;
}
.program-body {
  padding: var(--mdb-card-spacer-y) calc(var(--mdb-card-spacer-x) * 1.5);
}
</style>

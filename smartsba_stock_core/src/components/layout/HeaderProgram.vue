<template>
  <div class="d-flex justify-content-between">
    <label class="head-title h6 mb-0">
      <span><slot name="title"> </slot></span>
      <!-- <span v-if="props.title">{{ title }}</span> -->
      <span><slot name="subtitle"> </slot></span>
    </label>
    <div class="dropdown">
      <button
        id="aboutProgramMenu"
        type="button"
        class="btn btn-floating text-white shadow-0 position-absolute"
        :data-mdb-toggle="`${props.enableAboutVersion && 'dropdown'}`"
        aria-expanded="false"
      >
        <i class="fas fa-ellipsis-v"></i>
      </button>
      <ClientOnly v-if="props.enableAboutVersion">
        <ul class="dropdown-menu" aria-labelledby="aboutProgramMenu">
          <li>
            <button
              class="dropdown-item"
              type="button"
              data-mdb-toggle="modal"
              data-mdb-target="#staticBackdrop"
              :disable="!props.enableAboutVersion"
            >
              About Version
            </button>
          </li>
          <li v-if="enableReportIssue">
            <!-- :disable="!props.enableReportIssue" -->
            <button class="dropdown-item" type="button">Report an issue</button>
          </li>
        </ul>
        <UtilsProgramVersion />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
console.log('# Header Program Componnts');
const props = defineProps({
  // title: {
  //   type: String,
  //   required: true,
  //   default: 'Main Title',
  // },
  // subtitle: {
  //   type: String,
  //   required: true,
  // },
  enableAboutVersion: {
    type: Boolean,
    required: true,
    default: false,
  },
  enableReportIssue: {
    type: Boolean,
    required: false,
    default: false,
  },
});

console.log('# props: ', props);
</script>

<style scoped>
#aboutProgramMenu {
  top: -10px;
  min-width: 20px;
  right: calc(var(--mdb-card-cap-padding-x) * -1);
}

.head-title > span:nth-child(2) {
  content: '|';
  padding: 0 4px;
}
</style>

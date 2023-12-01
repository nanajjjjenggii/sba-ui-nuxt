<template>
  <!-- # InputErrorMsg props `for` for init to `id` prop -->
  <small :id="`${prop.for}-errror-msg`" class="text-danger">
    <slot></slot>
  </small>
</template>
<script lang="ts" setup>
const prop = defineProps<{
  for: string;
}>();
</script>

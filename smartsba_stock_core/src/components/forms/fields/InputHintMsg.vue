<template>
  <!-- # InputErrorMsg props `for` for init to `id` prop -->
  <small :id="`${$props.for}-hint-msg`" class="text-secondary">
    <slot></slot>
  </small>
</template>

<script lang="ts" setup>
defineProps<{ for: string }>();
</script>

<style scoped></style>

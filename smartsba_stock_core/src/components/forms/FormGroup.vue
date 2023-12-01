<template>
  <div :class="`form-group mb-3 ${className}`">
    <slot />
  </div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{ className?: string; label?: string }>(), {
  className: '',
  label: '',
});
</script>

<style lang="scss" scoped></style>

<template>
  <div :class="`header-box-label fw-bold ${!borderBottom ? '' : 'title-row'}`">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{ borderBottom?: boolean }>(), {
  borderBottom: false,
});
</script>

<style lang="scss" scoped>
.header-box-label {
  color: #375777 !important;
  font-size: 1.125rem;
  margin-bottom: 0.625rem;
  padding: 0 0 0.5rem;
}
</style>

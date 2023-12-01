<template>
  <label
    v-if="!noLabel"
    :id="defaultId"
    :for="props.for"
    class="form-label"
    :class="{
      [defaultClassName]: defaultClassName,
      require: required,
    }"
  >
    <slot></slot>
  </label>
</template>

<script lang="ts" setup>
interface FormLabel {
  for: string;
  required?: boolean;
  className?: string;
  noLabel?: boolean;
}

const props = withDefaults(defineProps<FormLabel>(), {
  for: 'label',
  required: false,
  className: '',
  noLabel: false,
});

const defaultId: string = props.for + '-label';
const defaultClassName: Ref<string> = ref<string>(
  props.className ? `${props.className}` : '',
);
</script>

<style lang="scss">
.form-label {
  display: block;
  min-height: 24px;
}
</style>

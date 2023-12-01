<template>
  <form
    class="needs-validation"
    novalidate
    @submit.prevent="emit('submit', $event)"
  >
    <slot />
  </form>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  (e: 'submit', event: Event): void;
}>();
</script>

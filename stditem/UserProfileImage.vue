<template>
  <div>
    <div :class="`div-circle ${className}`"></div>
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    className?: string;
    size?: string;
  }>(),
  {
    className: 'me-3',
    size: 'md',
  },
);
console.log('# props: ', props);
</script>

<style lang="scss" scoped>
.div-circle {
  border-radius: 50%;
  height: 4rem;
  width: 4rem;
  min-width: 50px;
  min-height: 50px;
  background-color: #d8d8d8;
  background-image: linear-gradient(
    141deg,
    #c5dcd2 0,
    #ececec 51%,
    #e1e4e3 75%
  );
  box-shadow: 1px 0 7px -2px #565656;
  display: flex;
  transition: 0.3s;
}
</style>

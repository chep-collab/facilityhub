<template>
  <USelect
    v-bind="$attrs"
    select-class=" rounded-lg  ring-[#D0D5DD] py-[10px] pl-[12px]"
  >
    <slot></slot>
  </USelect>
</template>

<script setup>
defineOptions({ inheritAttrs: false });
</script>

<style lang="css" scoped></style>

<!-- options i cant manipulate -->

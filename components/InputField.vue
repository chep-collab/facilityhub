<template>
  <UInput
    v-bind="$attrs"
    input-class=" rounded-lg  ring-[#D0D5DD] py-[10px] pl-[12px]"
  >
    <template v-if="$slots.leading" #leading>
      <slot name="leading"></slot>
    </template>
  </UInput>
</template>

<script setup>
defineOptions({ inheritAttrs: false });
</script>

<style lang="css" scoped></style>

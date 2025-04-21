<template>
  <UButton
    v-bind="$attrs"
    :size="$attrs.size"
    :class="$attrs.class"
    class="text-center py-[10px] justify-center w-full"
    color="primary"
  >
    <slot name="leading" />

    <slot />
  </UButton>
</template>

<script setup>
defineOptions({ inheritAttrs: false });
</script>

<script setup lang="ts">
defineProps<{
    action: () => void;
    label: string;
    icon?: string;
    bgColor: string;
    textColor: string;
}>()
</script>
<template>
  <button @click="action" class="flex items-center gap-2 w-full py-2.5 px-4 rounded-lg hover:cursor-pointer justify-center" :class="bgColor">
    <i :class="`${icon} ${textColor}`" style="font-size: 0.7rem"></i>
    <p class="text-xs" :class="textColor">{{ label }}</p>
  </button>
</template>

<style scoped></style>

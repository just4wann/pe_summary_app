<script setup lang="ts">
import { formateDescription, generateTimestamp } from '../../utils'
type Timestamp = {
  createdAt: string;
  updatedAt: string;
}

defineProps<{
    title: string,
    description: string;
    timestamp: Timestamp
}>()

</script>
<template>
  <section class="text-[0.7rem] flex flex-col gap-2">
    <h1 class="font-bold">{{ title }}</h1>
    <p class="leading-none" v-for="(line, index) in formateDescription(description)" :key="index">
      {{ line }}
    </p>
    <p v-if="timestamp.createdAt !== timestamp.updatedAt" class="text-[0.5rem] text-slate-400 self-end mt-2">Edited on {{ generateTimestamp(timestamp.updatedAt) }}</p>
  </section>
</template>

<style scoped></style>

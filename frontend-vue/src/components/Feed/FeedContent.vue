<script setup lang="ts">
import { formateDescription } from '../../utils'
defineProps<{
    title: string,
    description: string;
}>()

</script>
<template>
  <section class="text-[0.7rem] flex flex-col gap-2">
    <h1 class="font-bold">{{ title }}</h1>
    <p class="leading-2" v-for="(line, index) in formateDescription(description)" :key="index">
      {{ line }}
    </p>
  </section>
</template>

<style scoped></style>

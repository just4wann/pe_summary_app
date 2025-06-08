<script setup lang="ts">
import { ref } from 'vue';
import { formateDescription, generateTimestamp } from '../../utils';
type Timestamp = {
  createdAt: string;
  updatedAt: string;
};

defineProps<{
  title: string;
  description: string;
  timestamp: Timestamp;
  images?: string[];
}>();

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const img = ref<number>(0);
</script>
<template>
  <section class="text-[0.7rem] flex flex-col gap-2 -mt-3 mb-2">
    <h1 class="font-bold">{{ title }}</h1>
    <p class="leading-none" v-for="(line, index) in formateDescription(description)" :key="index">
      {{ line }}
    </p>
    <div v-if="images!.length != 0">
      <div class="flex gap-0.5 rounded-xl overflow-hidden">
        <Image :src="`${baseUrl}${images![img]}`" alt="image" preview/>
      </div>
      <Paginator v-model:first="img" :rows="1" :totalRecords="images!.length" template="PrevPageLink CurrentPageReport NextPageLink" class="text-[0.7rem]" />
    </div>
    <p v-if="timestamp.createdAt !== timestamp.updatedAt" class="text-[0.5rem] text-slate-400 self-end">Edited on {{ generateTimestamp(timestamp.updatedAt)[0] }}</p>
  </section>
</template>

<style scoped></style>

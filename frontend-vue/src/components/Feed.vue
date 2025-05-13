<script setup lang="ts">
import { computed } from 'vue';
import type { UserPostType } from '../types';

type FeedType = {
  title: string;
  description: string;
  factory: string;
  status: string;
  createdAt: string;
  User: UserPostType
};

const props = defineProps<{
  feed: FeedType;
}>();

const formateDescription = computed((): string[] => {
  return props.feed.description.split('\n');
})

const generateTimestamp = (createdAt: string): string => {
  const date = new Date(createdAt);
  const formatDate = date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
  });

  const time = date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return `${formatDate} at ${time}`;
};
</script>

<template>
  <Card class="p-5 pb-1">
    <template #header>
      <section class="flex justify-between">
        <div class="flex gap-2">
          <Avatar :label="feed.User.fullname.charAt(0)" shape="circle"/>
          <div class="flex flex-col justify-start">
            <p class="font-bold text-[0.7rem]">{{ feed.User.fullname }}</p>
            <p class="text-[0.6rem] text-slate-500">{{ generateTimestamp(feed.createdAt) }}</p>
          </div>
        </div>
        <div class="text-[0.1rem] mr-2 flex flex-col gap-1">
          <Badge :value="feed.factory" severity="secondary" size="small" />
          <Badge :value="feed.status" :severity="feed.status == 'solved' ? 'success' : 'warn'" size="small" />
        </div>
      </section>
    </template>
    <template #content>
      <section class="text-[0.7rem]">
        <h1 class="font-bold">
          {{ feed.title }}
        </h1>
        <p class="tracking-normal" v-for="(line, index) in formateDescription" :key="index">
          {{ line }}
        </p>
      </section>
      <Divider />
      <section class="flex items-center justify-between text-[0.7rem]">
        <section class="flex gap-2">
          <button class="flex items-center gap-2 p-2 rounded-md hover:bg-slate-50 hover:cursor-pointer active:bg-slate-100">
            <i class="pi pi-comments" style="font-size: 0.7rem" />
            <p class="poppins-semibold">Comments</p>
          </button>
          <button class="flex items-center gap-2 p-2 rounded-md hover:bg-slate-50 hover:cursor-pointer active:bg-slate-100">
            <i class="pi pi-thumbs-up" style="font-size: 0.7rem" />
            <p class="poppins-semibold">Likes</p>
          </button>
          <button class="flex items-center gap-2 p-2 rounded-md hover:bg-slate-50 hover:cursor-pointer active:bg-slate-100">
            <i class="pi pi-star" style="font-size: 0.7rem" />
            <p class="poppins-semibold">Rating</p>
          </button>
        </section>
        <section class="flex items-center gap-1 text-slate-500">
          <i class="pi pi-id-card" style="font-size: 0.7rem"></i>
          <p>{{ feed.User.nik }}</p>
        </section>
      </section>
    </template>
  </Card>
</template>

<style scoped></style>



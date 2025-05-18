<script setup lang="ts">
import type { FeedType } from '../../types';
import { generateTimestamp } from '../../utils'
defineProps<{
    feed: FeedType
}>()

</script>
<template>
  <section class="flex justify-between">
    <div class="flex gap-2">
      <Avatar :label="feed.User.fullname.charAt(0)" shape="circle" />
      <div class="flex flex-col justify-start">
        <div class="flex items-center gap-1">
          <p class="font-bold text-[0.7rem]">{{ feed.User.fullname.split(' ')[0] }}</p>
          <p class="text-[0.7rem] text-slate-500">@{{ feed.User.username }}</p>
        </div>
        <p class="text-[0.6rem] text-slate-400">{{ generateTimestamp(feed.createdAt) }}</p>
      </div>
    </div>
    <div class="text-[0.1rem] mr-2 flex flex-col gap-1">
      <span class="text-[0.5rem] text-center bg-slate-100 px-2 py-1 rounded-md">{{ feed.factory }}</span>
      <span class="text-[0.5rem] text-center px-2 py-1 rounded-md" :class="feed.status == 'Solved' ? 'bg-green-100' : 'bg-orange-100'">{{ feed.status }}</span>
    </div>
  </section>
</template>

<style scoped></style>

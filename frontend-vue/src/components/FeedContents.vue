<script setup lang="ts">
import type { FeedType } from '../types';
import Feed from './Feed.vue';

defineProps<{
  feeds: FeedType[];
}>();
</script>
<template>
  <ScrollPanel style="width: 100%; height: 500px;">
    <section class="flex gap-1 flex-col">
      <Feed v-for="feedContent in feeds" :feed="feedContent" />
      <p v-if="feeds.length === 0" class="text-sm text-center">No Post Available.</p>
    </section>
  </ScrollPanel>
</template>

<style scoped></style>

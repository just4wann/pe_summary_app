<script setup lang="ts">
import type { FeedType } from '../../types';

import FeedContent from './FeedContent.vue';
import FeedInfo from './FeedInfo.vue';
import FeedInteraction from './FeedInteraction.vue';

defineProps<{
  feeds: FeedType[];
}>();
</script>

<template>
  <section class="px-2 flex flex-col gap-1 -mt-4">
    <Card class="pt-5 -pb-2 px-5" v-for="(feed, index) in feeds" :key="index">
      <template #header>
        <FeedInfo :feed="feed" />
      </template>
      <template #content>
        <FeedContent
          :title="feed.title"
          :description="feed.description"
          :timestamp="{
            createdAt: feed.createdAt,
            updatedAt: feed.updatedAt,
          }"
        />
        <Divider />
        <FeedInteraction :nik="feed.User.nik" />
      </template>
    </Card>
    <p v-if="feeds.length === 0" class="text-xs text-center">No Feed Available.</p>
  </section>
</template>

<style scoped></style>

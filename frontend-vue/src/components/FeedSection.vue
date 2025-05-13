<script setup lang="ts">
import { ref, provide, type Ref, onMounted } from 'vue';
import type { FeedType } from '../types';
import { FeedAPI } from '../composables';
import { useToast } from 'primevue';

import FeedPost from './FeedPost.vue';
import FeedInputDialog from './FeedInputDialog.vue';
import Feed from './Feed.vue';

defineProps<{
  status: boolean;
}>();

const feedAPI = new FeedAPI(useToast());

const showDialog = ref<boolean>(false);
const feeds = ref<FeedType[]>([]);

provide('isDialogOpen', showDialog);
provide('toggleDialog', () => showDialog.value = !showDialog.value );
provide('closeDialog', () => showDialog.value = false );

const handleReceiveNewFeed = (newFeeds: Ref<FeedType[]>) => {
  feeds.value = newFeeds.value;
};

onMounted(() => {
  feedAPI.getAllFeed(feeds)
})
</script>
<template>
  <section class="flex flex-col gap-2 flex-2">
    <Card>
      <template #content>
        <FeedPost :isLogin="status" />
        <FeedInputDialog @feeds="handleReceiveNewFeed" />
        <Toast />
      </template>
    </Card>
    <Divider />
    <ScrollPanel style="width: 100%; height: 500px">
      <section class="flex gap-1 flex-col">
        <Feed v-for="feedContent in feeds" :feed="feedContent" />
        <p v-if="feeds.length === 0" class="text-sm text-center">No Post Available.</p>
      </section>
    </ScrollPanel>
  </section>
</template>

<style scoped></style>

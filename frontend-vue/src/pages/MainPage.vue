<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';

import { type FeedType, type UserType } from '../types';
import { UserAPI } from '../composables/users';
import { FeedAPI } from '../composables/feeds';

import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import AddPostAction from '../components/AddPostAction.vue';
import Feed from '../components/Feed/Feed.vue';

const userAPI = new UserAPI();
const feedAPI = new FeedAPI();

const isLogin = ref<boolean>(false);
const user = ref<UserType | null | undefined>();

const feeds = ref<FeedType[]>([])

onBeforeMount(async () => {
  user.value = await userAPI.getCurrentUser();
  if (user.value != null) {
    isLogin.value = true;
  }
  
  feedAPI.getAllFeed(feeds)
})
</script>

<template>
  <main class="flex flex-col gap-2 min-h-screen">
    <Header :isLogin="isLogin" />
    <AddPostAction :isLogin="isLogin" />
    <Divider>
      <p class="text-[0.5rem]">Feed</p>
    </Divider>
    <Feed :feeds="feeds" />
  </main>
  <Footer />
</template>

<style scoped></style>

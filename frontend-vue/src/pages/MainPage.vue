<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';

import { type FeedType, type UserType } from '../types';
import { UserAPI } from '../composables/users';
import { FeedAPI } from '../composables/feeds';

import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import AddPostAction from '../components/AddPostAction.vue';
import Feed from '../components/Feed/Feed.vue';
import Modal from '../components/Modal.vue';

const props = defineProps<{
  id?: string;
}>();

const userAPI = new UserAPI();
const feedAPI = new FeedAPI();

const showModal = ref<boolean>(true);
const isLogin = ref<boolean>(false);
const loadingState = ref<boolean>(true);
const user = ref<UserType | null | undefined>();

const feeds = ref<FeedType[]>([]);

(() => {
  if (props.id == 'posted') {
    setTimeout(() => {
      showModal.value = false;
      setTimeout(() => {
        showModal.value = true;
      }, 3500);
    }, 300);
  }
})();

const handleCloseModal = () => (showModal.value = true);

onBeforeMount(async () => {
  user.value = await userAPI.getCurrentUser();
  if (user.value != null) {
    isLogin.value = true;
  }

  const { status } = await feedAPI.getAllFeed(feeds);
  if (status || !status) loadingState.value = false;
});
</script>

<template>
  <div>
    <main class="relative flex flex-col gap-2 min-h-screen">
      <Header :isLogin="isLogin" />
      <AddPostAction :isLogin="isLogin" />
      <Divider>
        <p class="text-[0.5rem]">Feed</p>
      </Divider>
      <section v-if="loadingState" class="flex flex-col gap-2 px-3 -mt-3">
        <Skeleton height="10rem" v-for="i in 5" :key="i" />
      </section>
      <Feed v-else :feeds="feeds" messageWhileEmpty="No Feed Available" showFeedInteraction />
      <TransitionGroup name="slide" mode="out-in" tag="ul" class="absolute top-10 flex flex-col gap-2 right-14">
        <Modal v-if="!showModal" @closeModal="handleCloseModal" variant="success" message="Post added." />
      </TransitionGroup>
    </main>
    <Footer />
  </div>
</template>

<style scoped></style>

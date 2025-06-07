<script setup lang="ts">
import { ref } from 'vue';
import { SearchAPI } from '../composables/search';
import type { FeedType, FetchResultType } from '../types';

import Feed from '../components/Feed/Feed.vue';
import Modal from '../components/Modal.vue';
import Footer from '../components/Footer.vue';

const searchAPI = new SearchAPI();
const searchValue = ref<string>('');
const loadingState = ref<boolean>(false);
const searchResult = ref<FeedType[]>([]);
const showModal = ref<FetchResultType>({
  status: true,
  message: '',
});

const handleSearch = async () => {
  loadingState.value = true;
  showModal.value = await searchAPI.search(searchValue.value, searchResult);
  if (!showModal.value.status) {
    setTimeout(() => {
      showModal.value.status = true;
    }, 3500);
  }
  loadingState.value = false;
};

const handleCloseModal = () => {
  showModal.value.status = true;
};
</script>

<template>
  <div>
    <main class="min-h-screen flex flex-col gap-7">
      <header class="flex items-center bg-white px-5 py-4 gap-5">
        <button @click="$router.back()">
          <i class="pi pi-arrow-left"></i>
        </button>
        <section class="flex gap-6">
          <IconField>
            <InputIcon class="pi pi-search" />
            <InputText v-model="searchValue" placeholder="Search" size="small" class="w-72" />
          </IconField>
          <button @click="handleSearch()">
            <i class="pi pi-search mt-2"></i>
          </button>
        </section>
      </header>
      <TransitionGroup name="slide" mode="out-in" tag="ul" class="absolute top-2 flex flex-col gap-2 right-14">
        <Modal v-if="!showModal.status" variant="error" :message="showModal.message" @closeModal="handleCloseModal" icon="pi pi-times" key="$1" />
      </TransitionGroup>
      <section v-if="loadingState" class="flex flex-col gap-2 px-3 -mt-3">
        <Skeleton height="8rem" v-for="i in 5" :key="i" />
      </section>
      <Feed v-else :feeds="searchResult" :showFeedInteraction="false" />
    </main>
    <Footer />
  </div>
</template>

<style scoped></style>

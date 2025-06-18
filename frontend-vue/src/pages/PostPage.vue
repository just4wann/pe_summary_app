<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import type { FeedBodyType, FetchResultType } from '../types';
import { FeedAPI } from '../composables/feeds';

import ImageUpload from '../components/ImageUpload.vue';
import Modal from '../components/Modal.vue';
import Button from '../components/Button.vue';
import FieldTitle from '../components/Post/FieldTitle.vue';
import FieldDescription from '../components/Post/FieldDescription.vue';
import SelectFactoryDropdown from '../components/Post/SelectFactoryDropdown.vue';
import RadioCategories from '../components/Post/RadioCategories.vue';
import RadioStatuses from '../components/Post/RadioStatuses.vue';

const router = useRouter();
const feedAPI = new FeedAPI();

const feedBodyRequest: FeedBodyType = reactive({
  title: '',
  description: '',
  status: '',
  factory: {
    name: '',
    code: '',
  },
  category: '',
  imageUrl: [],
});

const isFileUploaded = ref<boolean>(false);
const showModal = ref<boolean>(true);
const result = ref<FetchResultType>({
  status: false,
  message: '',
});

const clear = () => {
  feedBodyRequest.title = '';
  feedBodyRequest.description = '';
  feedBodyRequest.factory = { name: '', code: '' };
  feedBodyRequest.status = '';
  feedBodyRequest.imageUrl = [];
  feedBodyRequest.category = '';
};

const back = () => {
  router.push({
    name: 'home',
    params: {
      id: 'main'
    }
  });
  clear();
};

const handleReceiveFiles = (files: string[]) => {
  feedBodyRequest.imageUrl = files;
};

const handleUploadResult = (result: boolean) => {
  isFileUploaded.value = result;
};

const handlePostFeed = async () => {
  result.value = await feedAPI.postFeed(feedBodyRequest);
  if (!result.value.status) {
    showModal.value = false;
    setTimeout(() => {
      showModal.value = true;
    }, 3500);
    return;
  }
  clear();
};

const handleCloseModal = () => (showModal.value = true);
</script>

<template>
  <main>
    <header class="flex items-center bg-white p-5 gap-5">
      <button @click="back()">
        <i class="pi pi-arrow-left"></i>
      </button>
      <h1>Create Post</h1>
    </header>
    <Card>
      <template #content>
        <section class="flex flex-col items-start justify-center">
          <FieldTitle v-model="feedBodyRequest.title"/>
          <FieldDescription v-model="feedBodyRequest.description"/>
          <SelectFactoryDropdown v-model="feedBodyRequest.factory"/>
          <div class="flex flex-wrap gap-4 text-xs mb-5">
            <RadioCategories v-model="feedBodyRequest.category" label="Trouble"/>
            <RadioCategories v-model="feedBodyRequest.category" label="Improvement"/>
          </div>
          <div class="flex flex-wrap gap-5 text-xs mb-5">
            <RadioStatuses v-model="feedBodyRequest.status" label="Solved"/>
            <RadioStatuses v-model="feedBodyRequest.status" label="Pending"/>
          </div>
          <ImageUpload @files="handleReceiveFiles" @uploded="handleUploadResult" />
          <Button :action="handlePostFeed" label="Post" icon="pi pi-send" bgColor="bg-slate-700" textColor="text-slate-50"/>
        </section>
      </template>
    </Card>
    <TransitionGroup name="slide" mode="out-in" tag="ul" class="absolute top-10 flex flex-col gap-2 right-14">
      <Modal v-if="!showModal" @closeModal="handleCloseModal" variant="error" :message="result.message" />
    </TransitionGroup>
  </main>
</template>

<style scoped></style>

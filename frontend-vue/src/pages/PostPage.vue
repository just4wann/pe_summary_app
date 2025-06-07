<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import type { FeedBodyType, ClearValueType, FetchResultType } from '../types';
import { Function } from '../composables';
import { FeedAPI } from '../composables/feeds';
import { factoryData } from '../constant';

import ImageUpload from '../components/ImageUpload.vue';
import Modal from '../components/Modal.vue';

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
  imageUrl: [],
});

const isFileUploaded = ref<boolean>(false);
const showModal = ref<boolean>(true);
const result = ref<FetchResultType>({
  status: false,
  message: ''
})

const fieldData: ClearValueType = feedBodyRequest;

const clear = () => {
  Function.useClear(fieldData, ['title', 'description', 'factory', 'status']);
  feedBodyRequest.title = fieldData.title;
  feedBodyRequest.description = fieldData.description;
  feedBodyRequest.factory = fieldData.factory;
  feedBodyRequest.status = fieldData.status;
  feedBodyRequest.imageUrl = [];
};

const back = () => {
  router.back();
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

const handleCloseModal = () => showModal.value = true;
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
          <FloatLabel variant="on" class="mb-3">
            <label for="title" class="text-sm">Title</label>
            <Textarea v-model="feedBodyRequest.title" autoResize rows="1" cols="40" class="text-sm font-light" />
          </FloatLabel>
          <FloatLabel variant="on" class="mb-3">
            <label for="description" class="text-sm">Description</label>
            <Textarea v-model="feedBodyRequest.description" autoResize rows="5" cols="40" />
          </FloatLabel>
          <div class="text-xs mb-5">
            <Select v-model="feedBodyRequest.factory" :options="factoryData" optionLabel="name" placeholder="Select a Factory" size="small" checkmark :highlightOnSelect="false" class="w-full md:w-56 text-xs" />
          </div>
          <div class="flex flex-wrap gap-4 text-xs mb-5">
            <div class="flex items-center gap-2">
              <RadioButton v-model="feedBodyRequest.status" inputId="solved" name="status" value="Solved" size="small" />
              <label for="solved">Solved</label>
            </div>
            <div class="flex items-center gap-2">
              <RadioButton v-model="feedBodyRequest.status" inputId="pending" name="status" value="Pending" size="small" />
              <label for="pending">Pending</label>
            </div>
          </div>
          <ImageUpload @files="handleReceiveFiles" @uploded="handleUploadResult" />
          <button @click="handlePostFeed()" class="flex items-center gap-2 w-full bg-slate-700 py-3 px-4 rounded-lg hover:cursor-pointer justify-center">
            <i class="pi pi-send text-slate-50" style="font-size: 0.7rem"></i>
            <p class="text-sm text-slate-50">Post</p>
          </button>
        </section>
      </template>
    </Card>
    <TransitionGroup name="slide" mode="out-in" tag="ul" class="absolute top-10 flex flex-col gap-2 right-14">
      <Modal v-if="!showModal" @closeModal="handleCloseModal" variant="error" :message="result.message" />
    </TransitionGroup>
  </main>
</template>

<style scoped></style>

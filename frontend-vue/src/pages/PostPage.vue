<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import type { FeedBodyType, FetchResultType } from '../types';
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
  message: '',
});

const clear = () => {
  feedBodyRequest.title = '';
  feedBodyRequest.description = '';
  feedBodyRequest.factory = { name: '', code: '' };
  feedBodyRequest.status = '';
  feedBodyRequest.imageUrl = [];
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
          <FloatLabel variant="on" class="mb-3">
            <label for="title" class="text-[0.7rem]">Title</label>
            <Textarea v-model="feedBodyRequest.title" autoResize rows="1" cols="30" style="font-size: 0.8rem;" />
          </FloatLabel>
          <FloatLabel variant="on" class="mb-3">
            <label for="description" class="text-[0.7rem]">Description</label>
            <Textarea v-model="feedBodyRequest.description" autoResize rows="5" cols="30" style="font-size: 0.8rem;"/>
          </FloatLabel>
          <Select v-model="feedBodyRequest.factory" :options="factoryData" optionLabel="name" placeholder="Select a Factory" class="mb-3 w-48" size="small" :labelStyle="{ fontSize: '0.65rem' }">
            <template #value="slotProps">
              <div v-if="slotProps.value.name != ''" class="flex items-center">
                <div>{{ slotProps.value.name }}</div>
              </div>
              <span v-else>
                {{ slotProps.placeholder }}
              </span>
            </template>
            <template #option="slotProps">
              <div class="flex items-center">
                <div class="text-[0.7rem]">{{ slotProps.option.name }}</div>
              </div>
            </template>
            <template #dropdownicon>
              <i class="pi pi-warehouse" style="font-size: 0.8rem" />
            </template>
          </Select>
          <div class="flex flex-wrap gap-4 text-xs mb-5">
            <div class="flex items-center gap-2">
              <RadioButton v-model="feedBodyRequest.status" inputId="solved" name="status" value="Solved" size="small" />
              <label for="solved" class="text-[0.6rem]">Solved</label>
            </div>
            <div class="flex items-center gap-2">
              <RadioButton v-model="feedBodyRequest.status" inputId="pending" name="status" value="Pending" size="small" />
              <label for="pending" class="text-[0.6rem]">Pending</label>
            </div>
          </div>
          <ImageUpload @files="handleReceiveFiles" @uploded="handleUploadResult" />
          <button @click="handlePostFeed()" class="flex items-center gap-2 w-full bg-slate-700 py-2.5 px-4 rounded-lg hover:cursor-pointer justify-center">
            <i class="pi pi-send text-slate-50" style="font-size: 0.7rem"></i>
            <p class="text-xs text-slate-50">Post</p>
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

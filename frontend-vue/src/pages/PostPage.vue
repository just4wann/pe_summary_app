<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import type { FactoryType, FeedBodyType, ClearValueType } from '../types';
import { Function, FeedAPI } from '../composables';
import { factoryData } from '../constant';
import { useToast } from 'primevue';

const router = useRouter();
const feedAPI = new FeedAPI(useToast());

const titleValue = ref<string>('');
const descriptionValue = ref<string>('');
const status = ref<string>('');
const selectedFactory = ref<FactoryType>({
  name: '',
  code: '',
});

const fieldData: ClearValueType = {
  title: titleValue.value,
  description: descriptionValue.value,
  factory: selectedFactory.value,
  status: status.value,
};

const clear = () => {
  Function.useClear(fieldData, ['title', 'description', 'factory', 'status']);
  titleValue.value = fieldData.title;
  descriptionValue.value = fieldData.description;
  selectedFactory.value = fieldData.factory;
  status.value = fieldData.status;
};

const back = () => {
  router.back()
  clear()
}

const postFeed = async () => {
  const feedBody: FeedBodyType = {
    title: titleValue.value,
    description: descriptionValue.value,
    factory: selectedFactory.value.name,
    status: status.value,
  };
  const result = await feedAPI.postFeed(feedBody);
  if (result) {
    clear();
  }
};
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
            <Textarea v-model="titleValue" autoResize rows="1" cols="25" class="text-sm font-light" />
          </FloatLabel>
          <FloatLabel variant="on" class="mb-3">
            <label for="description" class="text-sm">Description</label>
            <Textarea v-model="descriptionValue" autoResize rows="5" cols="25" />
          </FloatLabel>
          <div class="text-xs mb-5">
            <Select v-model="selectedFactory" :options="factoryData" optionLabel="name" placeholder="Select a Factory" size="small" checkmark :highlightOnSelect="false" class="w-full md:w-56 text-xs" />
          </div>
          <div class="flex flex-wrap gap-4 text-xs mb-5">
            <div class="flex items-center gap-2">
              <RadioButton v-model="status" inputId="solved" name="status" value="Solved" size="small" />
              <label for="solved">Solved</label>
            </div>
            <div class="flex items-center gap-2">
              <RadioButton v-model="status" inputId="pending" name="status" value="Pending" size="small" />
              <label for="pending">Pending</label>
            </div>
          </div>
          <!-- <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" :maxFileSize="1000000" @upload="onUpload" :auto="true" chooseLabel="Browse" /> -->
          <button @click="postFeed()" class="flex items-center gap-2 w-full bg-slate-700 py-3 px-4 rounded-lg hover:cursor-pointer justify-center">
            <i class="pi pi-send text-slate-50" style="font-size: 0.7rem"></i>
            <p class="text-sm text-slate-50">Post</p>
          </button>
        </section>
      </template>
    </Card>
  </main>
</template>

<style scoped>
</style>

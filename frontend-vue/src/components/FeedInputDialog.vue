<script setup lang="ts">
import { inject, ref, type Ref } from 'vue';
import { useToast } from 'primevue';
import { factoryData } from '../constant';
import type { FactoryType, FeedBodyType, FeedType, ClearValueType } from '../types';
import { FeedAPI, Function } from '../composables';

const toast = useToast();
const feedAPI = new FeedAPI(toast);

const emit = defineEmits<{
  (e: 'feeds', payload: Ref<FeedType[]>): void;
}>()

const feeds = ref<FeedType[]>([]);

const isDialogOpen = inject<Ref<boolean>>('isDialogOpen');
const closeDialog = inject<() => void>('closeDialog');

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

  closeDialog?.();
};

const postFeed = async () => {
  const feedBody: FeedBodyType = {
    title: titleValue.value,
    description: descriptionValue.value,
    factory: selectedFactory.value.name,
    status: status.value,
  };
  const result = await feedAPI.postFeed(feedBody, feeds);
  if (result) {
    emit('feeds', feeds);
    clear();
  }
};
</script>
<template>
  <Dialog v-model:visible="isDialogOpen" modal header="Post Trouble" :style="{ width: '30rem' }">
    <span class="block mb-5">Describe your trouble information.</span>
    <FloatLabel variant="on" class="mb-3">
      <label for="title" class="text-sm">Title</label>
      <Textarea v-model="titleValue" autoResize rows="1" cols="40" class="text-sm font-light" />
    </FloatLabel>
    <FloatLabel variant="on" class="mb-3">
      <label for="description" class="text-sm">Description</label>
      <Textarea v-model="descriptionValue" autoResize rows="5" cols="50" />
    </FloatLabel>
    <div class="text-xs mb-5">
      <Select v-model="selectedFactory" :options="factoryData" optionLabel="name" placeholder="Select a Factory" size="small" checkmark :highlightOnSelect="false" class="w-full md:w-56 text-xs" />
    </div>
    <div class="flex flex-wrap gap-4 text-xs mb-5">
      <div class="flex items-center gap-2">
        <RadioButton v-model="status" inputId="solved" name="status" value="solved" size="small" />
        <label for="solved">Solved</label>
      </div>
      <div class="flex items-center gap-2">
        <RadioButton v-model="status" inputId="pending" name="status" value="pending" size="small" />
        <label for="pending">Pending</label>
      </div>
    </div>
    <div class="flex justify-end gap-2">
      <button @click="clear()" class="flex items-center gap-1 bg-slate-200 py-2 px-4 rounded-lg hover:cursor-pointer">
        <p class="text-xs">Cancel</p>
      </button>
      <button @click="postFeed()" class="flex items-center gap-2 bg-slate-700 py-2 px-4 rounded-lg hover:cursor-pointer">
        <i class="pi pi-send text-slate-50" style="font-size: 0.6rem"></i>
        <p class="text-xs text-slate-50">Post</p>
      </button>
    </div>
  </Dialog>
  <Toast />
</template>

<style scoped></style>

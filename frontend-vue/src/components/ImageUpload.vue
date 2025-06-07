<script setup lang="ts">
import { ref } from 'vue';
import { usePrimeVue } from 'primevue/config';
import type { FileUploadSelectEvent } from 'primevue';
import UploadImageAPI from '../composables/upload';

interface FileURL extends File {
  objectURL: string;
}

const emit = defineEmits<{
  files: [data: string[]];
  uploded: [status: boolean];
}>();

const $primevue = usePrimeVue();

const totalSize = ref<number>(0);
const totalSizePercent = ref<number>(0);
const files = ref<FileURL[]>([]);
const isUploaded = ref<boolean>(false);

const onRemoveFile = (file: FileURL, removeFileCallback: (i: number) => void, index: number) => {
  removeFileCallback(index);
  totalSize.value -= parseInt(formatSize(file.size));
  totalSizePercent.value = totalSize.value / 10;
};

const onSelectedFiles = (event: FileUploadSelectEvent) => {
  files.value = event.files;
  files.value.forEach((file: FileURL) => {
    totalSize.value += parseInt(formatSize(file.size));
  });
};

const uploadEvent = async (callback: () => void) => {
  const formData = new FormData();
  files.value.forEach((file: FileURL) => {
    formData.append('uploadedFile', file);
  });
  const result = await UploadImageAPI.upload(formData);
  if (result.length == 0) {
    emit('uploded', false);
    return;
  }
  isUploaded.value = true;
  emit('files', result);
  emit('uploded', true);

  totalSizePercent.value = totalSize.value / 10;
  callback();
};

const formatSize = (bytes: number) => {
  const k = 1024;
  const dm = 3;
  const sizes = $primevue.config.locale!.fileSizeTypes;

  if (bytes === 0) {
    return `0 ${sizes[0]}`;
  }

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${formattedSize} ${sizes[i]}`;
};
</script>

<template>
  <div class="card mb-4 w-full">
    <FileUpload :multiple="true" accept="image/*" :maxFileSize="1000000" @select="onSelectedFiles($event)">
      <template #header="{ chooseCallback, uploadCallback, clearCallback }">
        <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
          <div class="flex gap-2">
            <button @click="chooseCallback()" class="bg-blue-50 hover:cursor-pointer px-3 py-0.5 rounded-lg">
              <i class="pi pi-images text-blue-500" style="font-size: 0.8rem"></i>
            </button>
            <button @click="uploadEvent(uploadCallback)" class="bg-green-50 hover:cursor-pointer px-3 py-0.5 rounded-lg">
              <i class="pi pi-cloud-upload text-green-500" style="font-size: 0.8rem"></i>
            </button>
            <button @click="clearCallback()" class="bg-red-50 hover:cursor-pointer px-3 py-0.5 rounded-lg">
              <i class="pi pi-times text-red-500" style="font-size: 0.8rem"></i>
            </button>
          </div>
          <span class="whitespace-nowrap text-xs">{{ totalSize }}kB / 1Mb</span>
        </div>
      </template>
      <template #content="{ files, removeFileCallback }">
        <div class="flex flex-col gap-8 pt-4">
          <div v-if="files.length > 0">
            <div class="flex flex-wrap gap-2">
              <div v-for="(file, index) of files as FileURL[]" :key="file.name + file.type + file.size" class="flex flex-col items-center gap-1">
                <div>
                  <img role="presentation" :alt="file.name" :src="file.objectURL" width="100" height="30" />
                </div>
                <span class="text-xs font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{ file.name }}</span>
                <div class="text-[0.6rem]">{{ formatSize(file.size) }}</div>
                <span class="text-[0.5rem] text-slate-50 py-1 px-2 rounded-lg" :class="isUploaded ? 'bg-green-500' : 'bg-orange-400'">{{ isUploaded ? 'Completed' : 'Pending' }}</span>
                <button @click="onRemoveFile(file, removeFileCallback, index)" class="hover:cursor-pointer px-2 rounded-full">
                  <i class="pi pi-times" style="font-size: 0.7rem"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #empty>
        <div class="flex items-center justify-center flex-col gap-2 -mt-5">
          <i class="pi pi-cloud-upload border border-slate-400 p-3 rounded-full" style="font-size: 1.5rem" />
          <p class="text-xs">Upload your image here</p>
        </div>
      </template>
    </FileUpload>
  </div>
</template>

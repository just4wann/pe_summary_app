<script setup lang="ts">
import { inject } from 'vue';

defineProps<{
    isLogin: boolean
}>()

const toggleDialog = inject<() => void>('toggleDialog');
</script>
<template>
  <main class="flex items-center gap-2 justify-between">
    <p class="text-sm">Post your result trouble . . .</p>
    <button @click="toggleDialog" class="flex items-center gap-1 bg-slate-700 py-2 px-4 rounded-lg hover:cursor-pointer disabled:bg-slate-400 disabled:cursor-not-allowed" :disabled="!isLogin">
      <i class="pi pi-file-edit text-slate-50" style="font-size: 0.8rem"></i>
      <p class="text-xs text-slate-50">Add Post</p>
    </button>
  </main>
</template>

<style scoped></style>

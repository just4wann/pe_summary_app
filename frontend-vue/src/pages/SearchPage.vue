<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter();

const searchValue = ref<string>('')
</script>

<template>
  <main class="min-h-screen">
    <header class="flex items-center bg-white px-5 py-4 gap-5">
      <button @click="router.back()">
        <i class="pi pi-arrow-left"></i>
      </button>
      <section class="flex gap-6">
        <IconField>
          <InputIcon class="pi pi-search" />
          <InputText v-model="searchValue" placeholder="Search" size="small" class="w-72" />
        </IconField>
        <button>
          <i class="pi pi-search mt-2"></i>
        </button>
      </section>
    </header>
  </main>
  <footer class="sticky bg-white bottom-0 py-5 px-20 flex items-center justify-between rounded-xl">
    <RouterLink to="/">
      <i class="pi pi-home" style="font-size: 1.1rem"></i>
    </RouterLink>
    <RouterLink to="/search">
      <i class="pi pi-search" style="font-size: 1.1rem"></i>
    </RouterLink>
    <RouterLink to="/profile">
      <i class="pi pi-user" style="font-size: 1.1rem"></i>
    </RouterLink>
  </footer>
</template>

<style scoped>
</style>

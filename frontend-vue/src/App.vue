<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isMobile = window.innerWidth > 500 ? true : false;

onMounted(() => {
  router.push('/');
});
</script>

<template>
  <main>
    <h1 class="isMobile text-center mt-10" v-if="isMobile">
      <p>This website cannot access on PC or Laptop. Please use your phone to access this website</p>
    </h1>
    <RouterView v-else></RouterView>
  </main>
</template>

<style scoped></style>

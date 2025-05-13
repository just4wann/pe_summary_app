<script setup lang="ts">
defineProps<{
  isLogin: boolean;
  logo: string | undefined;
}>();
</script>
<template>
  <section class="flex justify-between items-center mx-5">
    <h1 class="text-2xl">SummaryPE</h1>
    <Avatar v-if="isLogin" :label="logo" size="small" shape="circle" />
    <RouterLink v-else to="/login" class="flex items-center gap-2 text-xs bg-slate-200 text-slate-700 py-2 px-4 rounded-lg hover:cursor-pointer">
      <i class="pi pi-user" style="font-size: 0.7rem" />
      <p>Sign In</p>
    </RouterLink>
  </section>
</template>

<style scoped></style>

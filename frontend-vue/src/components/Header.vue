<script setup lang="ts">
defineProps<{
  isLogin: boolean;
}>();
</script>
<template>
  <header class="flex justify-between items-center bg-white p-5">
    <h1 class="text-lg">SummaryPE</h1>
    <section class="flex justify-center items-center" v-if="isLogin">
      <OverlayBadge severity="danger">
        <i class="pi pi-bell" style="font-size: 1.1rem"></i>
      </OverlayBadge>
    </section>
    <RouterLink v-else to="/login" class="flex items-center gap-2 text-xs bg-slate-200 text-slate-700 py-1.5 px-2.5 rounded-md hover:cursor-pointer">
      <i class="pi pi-sign-in" style="font-size: 0.7rem" />
      <p class="text-[0.6rem]">Sign In</p>
    </RouterLink>
  </header>
</template>

<style scoped></style>

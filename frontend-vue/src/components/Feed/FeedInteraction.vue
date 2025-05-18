<script setup lang="ts">
defineProps<{
    nik: string
}>()
</script>
<template>
  <section class="flex items-center justify-between text-[0.7rem] -mt-3">
    <section class="flex gap-2">
      <button class="flex items-center gap-1 p-2 rounded-md hover:bg-slate-50 hover:cursor-pointer active:bg-slate-100">
        <i class="pi pi-comments" style="font-size: 0.7rem" />
        <p class="poppins-semibold">10</p>
      </button>
      <button class="flex items-center gap-1 p-2 rounded-md hover:bg-slate-50 hover:cursor-pointer active:bg-slate-100">
        <i class="pi pi-thumbs-up" style="font-size: 0.7rem" />
        <p class="poppins-semibold">99</p>
      </button>
      <button class="flex items-center gap-1 p-2 rounded-md hover:bg-slate-50 hover:cursor-pointer active:bg-slate-100">
        <i class="pi pi-star" style="font-size: 0.7rem" />
        <p class="poppins-semibold">1</p>
      </button>
    </section>
    <section class="flex items-center gap-1 text-slate-500">
      <i class="pi pi-id-card" style="font-size: 0.7rem"></i>
      <p class="text-[0.6rem]">{{ nik }}</p>
    </section>
  </section>
</template>

<style scoped></style>

<script setup lang="ts">
const props = defineProps<{
    variant: 'error' | 'warning' | 'success',
    message: string,
}>();

defineEmits<{
    closeModal: []
}>();

const bgVariant = (): string => {
  return props.variant == 'success' ? 'bg-green-200 border-1 border-green-500' : 'bg-red-200 border-1 border-red-500'
}

const iconVariant = (): string => {
  return props.variant == 'success' ? 'pi pi-check text-slate-50 bg-green-500 p-1 rounded-full' : 'pi pi-times text-slate-50 bg-red-500 p-1 rounded-full'
}
</script>
<template>
  <main :class="`${variant} ${bgVariant()}`" class="relative flex justify-start items-center gap-3 w-56 py-3 px-5 text-slate-800 text-center inset-x-8 z-10 rounded-lg shadow-lg">
    <i :class="iconVariant()" style="font-size: 0.7rem; font-weight: bold;"/>
    <p class="leading-tight text-[0.7rem] text-start">{{ message }}</p>
    <i @click="$emit('closeModal')" class="pi pi-times absolute top-2 right-2 hover:cursor-pointer" style="font-size: 0.6rem;"/>
  </main>
</template>

<style scoped></style>

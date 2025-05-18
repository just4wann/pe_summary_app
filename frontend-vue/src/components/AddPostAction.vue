<script setup lang="ts">
defineProps<{
  isLogin: boolean;
}>();
</script>
<template>
  <section class="px-2 -mb-4">
    <Card>
      <template #content>
        <section class="flex items-center gap-2 justify-between">
          <p class="text-xs">Post your result trouble . . .</p>
          <RouterLink to="/add">
            <button :disabled="!isLogin" class="flex items-center gap-1 bg-slate-700 py-2 px-3.5 rounded-lg hover:cursor-pointer disabled:bg-slate-400 disabled:cursor-not-allowed">
              <i class="pi pi-file-edit text-slate-50" style="font-size: 0.7rem"></i>
              <p class="text-[0.5rem] text-slate-50">Add Post</p>
            </button>
          </RouterLink>
        </section>
      </template>
    </Card>
  </section>
</template>

<style scoped></style>

<script setup lang="ts">
import type { UserType } from '../types';

defineProps<{
    user: UserType | null | undefined
}>()
</script>
<template>
  <Card class="p-5 flex-1">
    <template #header>
      <section class="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <Avatar :label="user?.fullname.charAt(0)" size="normal" shape="circle" />
        <div>
          <h1 class="poppins-semibold text-sm">{{ user?.fullname }}</h1>
          <p class="text-slate-400 text-xs">@{{ user?.username }}</p>
        </div>
      </section>
    </template>
    <template #content>
      <section class="-ml-3 mt-5 p-2 hover:cursor-pointer hover:bg-slate-100">
        <div class="flex items-center gap-6">
          <i class="pi pi-objects-column" style="font-size: 1.1rem" />
          <p class="text-sm poppins-semibold">Feed</p>
        </div>
      </section>
    </template>
  </Card>
</template>

<style scoped></style>

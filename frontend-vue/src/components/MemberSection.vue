<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { UserType } from '../types';
import { UserAPI } from '../composables/users';

const userAPI = new UserAPI()
const users = ref<UserType[]>([]);

onMounted(() => {
  userAPI.getAllUser(users);
})
</script>
<template>
  <Card class="p-5 w-64 -mr-5">
    <template #header>
      <h1 class="text-sm">Member List</h1>
      <Divider />
      <ul class="flex flex-col gap-2">
        <li v-for="user in users">
          <Chip class="text-xs w-32">
            <Badge />
            <span class="px-2 py-1 bg-slate-700 rounded-full text-slate-50">{{ user.fullname.charAt(0) }}</span>
            <span>{{ user.fullname.split(' ')[0] }}</span>
          </Chip>
        </li>
      </ul>
    </template>
  </Card>
  <div></div>
</template>

<style scoped></style>

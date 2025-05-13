<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useToast } from 'primevue';

import { type UserType } from '../types';
import { UserAPI } from '../composables';

import Header from '../components/Header.vue';
import SideSection from '../components/SideSection.vue';
import FeedSection from '../components/FeedSection.vue';
import MemberSection from '../components/MemberSection.vue';

const userAPI = new UserAPI(useToast());

const isLogin = ref<boolean>(false);
const user = ref<UserType | null | undefined>();

onMounted(async () => {
  user.value = await userAPI.getCurrentUser();
  if (user.value != null) {
    isLogin.value = true;
  }
});
</script>

<template>
    <Card class="p-5">
      <template #header>
        <Header :isLogin="isLogin" :logo="user?.fullname.charAt(0)" />
        <Divider />
      </template>
      <template #content>
        <main class="flex gap-5 -mt-5">
          <SideSection :user="user"/>
          <FeedSection :status="isLogin"/>
          <MemberSection/>
        </main>
      </template>
    </Card>
</template>

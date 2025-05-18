<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useToast } from 'primevue';

import { type FeedOfUserType, type UserType } from '../types';
import { FeedAPI, UserAPI } from '../composables';
import { generateTimestamp, formateDescription } from '../utils';


const router = useRouter();
const contentOf = ref<number>(0);

const userAPI = new UserAPI(useToast());
const feedAPI = new FeedAPI(useToast());

const user = ref<UserType | null | undefined>();

const feeds = ref<FeedOfUserType[]>([
  {
    title: '',
    description: '',
    factory: '',
    status: '',
    createdAt: '',
  }
])

onMounted(async () => {
  await feedAPI.getFeedUser(feeds);
  user.value = await userAPI.getCurrentUser();
});
</script>
<template>
  <main class="min-h-screen flex flex-col gap-2">
    <header class="flex items-center justify-between bg-white p-5">
      <div class="flex items-center gap-5">
        <button @click="router.back()">
          <i class="pi pi-arrow-left"></i>
        </button>
        <h1>Profile</h1>
      </div>
      <button class="flex items-center gap-1.5 text-xs bg-red-500 text-slate-50 py-2 px-3 rounded-md hover:cursor-pointer">
        <i class="pi pi-sign-out" style="font-size: 0.7rem" />
        <p class="text-[0.6rem]">Sign Out</p>
      </button>
    </header>
    <section class="px-2">
      <Card class="h-screen">
        <template #header>
          <section class="flex flex-col gap-6 items-center justify-center mt-5">
            <div class="flex items-center gap-5">
              <Avatar :label="user?.fullname.charAt(0)" size="xlarge" shape="circle" />
              <div class="flex flex-col gap-2">
                <div>
                  <p class="poppins-semibold text-[0.95rem]">{{ user?.fullname }}</p>
                  <p class="text-[0.8rem] text-slate-400 -mt-1">@{{ user?.username }}</p>
                </div>
                <button class="flex items-center gap-2 text-xs bg-slate-100 text-slate-700 py-1.5 px-2.5 rounded-md w-24 hover:cursor-pointer">
                  <i class="pi pi-pencil" style="font-size: 0.7rem" />
                  <p class="text-[0.6rem]">Edit Profile</p>
                </button>
              </div>
            </div>
            <div class="flex flex-col gap-1 justify-center items-center">
              <p class="poppins-bold text-xl">{{ feeds.length }}</p>
              <p class="text-slate-500 text-[0.85rem]">Total Post</p>
            </div>
          </section>
        </template>
        <template #content>
          <section class="mt-5 flex flex-col gap-3">
            <p>Posts</p>
            <section class="px-1 flex flex-col gap-1">
              <p v-if="feeds.length === 0" class="text-xs text-center">No Feed Available.</p>
              <Card class="pt-5 -pb-2 px-5">
                <template #header>
                  <section class="flex justify-between items-center">
                    <p class="text-[0.6rem] text-slate-400">{{ generateTimestamp(feeds[contentOf].createdAt) }}</p>
                    <div class="flex items-center gap-2">
                      <div class="text-[0.1rem] mr-2 flex gap-1">
                        <span class="text-[0.5rem] text-center bg-slate-100 px-2 py-1 rounded-md">{{ feeds[contentOf].factory }}</span>
                        <span class="text-[0.5rem] text-center px-2 py-1 rounded-md" :class="feeds[contentOf].status == 'Solved' ? 'bg-green-100' : 'bg-orange-100'">
                          {{ feeds[contentOf].status }}
                        </span>
                      </div>
                      <button>
                        <i class="pi pi-ellipsis-v" style="font-size: 0.8rem"></i>
                      </button>
                      <section></section>
                    </div>
                  </section>
                </template>
                <template #content>
                  <section class="text-[0.7rem] flex flex-col gap-1 -mt-1">
                    <h1 class="font-bold">{{ feeds[contentOf].title }}</h1>
                    <p class="tracking-normal" v-for="(line, index) in formateDescription(feeds[contentOf].description)" :key="index">
                      {{ line }}
                    </p>
                  </section>
                </template>
              </Card>
            </section>
            <Paginator v-model:first="contentOf" :rows="1" :totalRecords="feeds.length" template="PrevPageLink CurrentPageReport NextPageLink" class="text-[0.7rem]" />
          </section>
        </template>
      </Card>
    </section>
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

<style scoped></style>

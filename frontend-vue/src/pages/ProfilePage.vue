<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useConfirm } from 'primevue';

import { type FeedOfUserType, type FeedUpdateBodyType, type UserType } from '../types';
import { FeedAPI } from '../composables/feeds';
import { UserAPI } from '../composables/users';
import { generateTimestamp, formateDescription } from '../utils';
import { useRouter } from 'vue-router';

const router = useRouter();
const contentOf = ref<number>(0);
const visible = ref<boolean>(false);
const factory = ref<string>('');
const status = ref<string>('');
const title = ref<string>('');
const description = ref<string>('');

const userAPI = new UserAPI();
const feedAPI = new FeedAPI();

const user = ref<UserType | null | undefined>();
const isPostDeleted = ref<boolean>(false);
const isPostUpdated = ref<boolean>(false);

const feeds = ref<FeedOfUserType[]>([
  {
    id: 0,
    title: '',
    description: '',
    factory: '',
    status: '',
    createdAt: '',
  },
]);

const clearField = () => {
  title.value = '';
  description.value = '';
  factory.value = '';
  status.value = '';

  visible.value = false;
}

const update = async (id: number) => {
  const data: FeedUpdateBodyType = {
    title: title.value,
    description: description.value,
    factory: factory.value,
    status: status.value,
  };

  isPostUpdated.value = await feedAPI.updateFeedUser(data, id);
  if (isPostUpdated.value) clearField();
};

const destroy = async (id: number) => {
  isPostDeleted.value = await feedAPI.deleteFeedUser(id);
};

const confirm = useConfirm();

const showConfirmationDelete = (event: any) => {
  confirm.require({
    target: event.currentTarget,
    group: 'delete',
    message: 'Delete this post?',
    icon: 'pi pi-exclamation-circle',
    rejectProps: {
      icon: 'pi pi-times',
      label: 'Cancel',
      style: {
        backgroundColor: 'red',
        fontSize: '0.6rem',
        border: 'none',
      },
    },
    acceptProps: {
      icon: 'pi pi-check',
      label: 'Confirm',
      style: {
        backgroundColor: 'black',
        fontSize: '0.6rem',
        border: 'none',
      },
    },
    accept: () => {
      destroy(feeds.value[contentOf.value].id);
    },
    reject: () => {},
  });
};

const items = ref([
  {
    label: 'Edit',
    icon: 'pi pi-pencil',
    command: () => {
      visible.value = true;
    },
  },
  {
    label: 'Delete',
    icon: 'pi pi-trash',
    command: () => {
      showConfirmationDelete(event);
    },
  },
]);

const showConfirmationLogout = (event: any) => {
  confirm.require({
    target: event.currentTarget,
    group: 'templating',
    message: 'Are you sure?',
    icon: 'pi pi-exclamation-circle',
    rejectProps: {
      icon: 'pi pi-times',
      label: 'Cancel',
      style: {
        backgroundColor: 'red',
        fontSize: '0.6rem',
        border: 'none',
      },
    },
    acceptProps: {
      icon: 'pi pi-check',
      label: 'Confirm',
      style: {
        backgroundColor: 'black',
        fontSize: '0.6rem',
        border: 'none',
      },
    },
    accept: () => {
      userAPI.userLogout();
    },
    reject: () => {},
  });
};

onBeforeMount(async () => {
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
      <ConfirmPopup group="templating">
        <template #message="slotProps">
          <div class="flex flex-col items-center justify-center p-3 text-xs gap-2">
            <i :class="slotProps.message.icon" class="text-6xl text-primary-500"></i>
            <p>{{ slotProps.message.message }}</p>
          </div>
        </template>
      </ConfirmPopup>
      <button v-if="user" @click="showConfirmationLogout($event)" class="flex items-center gap-1.5 text-xs bg-red-500 text-slate-50 py-2 px-3 rounded-md hover:cursor-pointer">
        <i class="pi pi-sign-out" style="font-size: 0.7rem" />
        <p class="text-[0.6rem]">Sign Out</p>
      </button>
    </header>
    <section v-if="!user" class="px-2 bg-white flex flex-col items-center gap-2 h-screen -mt-2 p-50">
      <RouterLink to="/login" class="flex items-center gap-2 text-xs bg-slate-200 text-slate-700 py-3.5 px-4.5 rounded-md hover:cursor-pointer">
        <i class="pi pi-sign-in" style="font-size: 0.8rem" />
        <p class="text-xs">Sign In</p>
      </RouterLink>
    </section>
    <section v-else class="px-2">
      <Card class="relative h-screen">
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
              <p v-if="feeds.length === 0" class="text-xs text-center">You haven't post anything.</p>
              <Card v-else class="pt-5 px-5" :key="feeds[contentOf].id">
                <template #header>
                  <section class="flex justify-between items-start">
                    <p class="text-[0.6rem] text-slate-400 mt-1">{{ generateTimestamp(feeds[contentOf].createdAt) }}</p>
                    <div class="relative flex items-start gap-2">
                      <div class="text-[0.1rem] mr-2 flex gap-1">
                        <span class="text-[0.5rem] text-center bg-slate-100 px-2 py-1 rounded-md">{{ feeds[contentOf].factory }}</span>
                        <span class="text-[0.5rem] text-center px-2 py-1 rounded-md" :class="feeds[contentOf].status == 'Solved' ? 'bg-green-100' : 'bg-orange-100'">
                          {{ feeds[contentOf].status }}
                        </span>
                      </div>
                      <div class="flex justify-center mt-[-1px]">
                        <SpeedDial :model="items" direction="down" :transitionDelay="40" pt:menuitem="">
                          <template #button="{ toggleCallback }">
                            <button @click="toggleCallback">
                              <i class="pi pi-ellipsis-v" style="font-size: 0.8rem"></i>
                            </button>
                          </template>
                          <template #item="{ item, toggleCallback }">
                            <div class="flex flex-col items-center justify-between p-2 bg-slate-200 rounded-full" @click="toggleCallback">
                              <span :class="item.icon" style="font-size: 0.8rem" />
                            </div>
                          </template>
                        </SpeedDial>
                      </div>
                      <ConfirmPopup group="delete">
                        <template #message="slotProps">
                          <div class="flex flex-col items-center justify-center p-3 text-xs gap-2">
                            <i :class="slotProps.message.icon" class="text-6xl text-primary-500"></i>
                            <p>{{ slotProps.message.message }}</p>
                          </div>
                        </template>
                      </ConfirmPopup>
                    </div>
                  </section>
                </template>
                <template #content>
                  <section class="text-[0.7rem] flex flex-col gap-1 -mt-20">
                    <h1 class="font-bold">{{ feeds[contentOf].title }}</h1>
                    <p class="leading-none" v-for="(line, index) in formateDescription(feeds[contentOf].description)" :key="index">
                      {{ line }}
                    </p>
                  </section>
                  <Dialog v-model:visible="visible" modal :closable="false" :style="{ width: '20rem' }">
                    <template #header>
                      <h1>Edit Post</h1>
                    </template>
                    <section class="flex flex-col justify-center items-start gap-3">
                      <h1 class="text-xs">Update your information trouble</h1>
                      <div class="flex flex-col justify-center gap-2 w-full">
                        <input v-model="title" type="text" id="title" placeholder="Title" class="py-2 px-3 border border-slate-400 rounded-lg text-xs focus:outline-slate-400" />
                        <textarea v-model="description" id="desc" placeholder="Description" class="h-28 text-xs border border-slate-400 py-2 px-3 rounded-lg resize-none focus:outline-slate-400" />
                        <div class="flex flex-wrap justify-center items-center gap-3 text-xs border border-slate-400 py-4 px-2 rounded-lg">
                          <div class="flex items-center gap-2">
                            <RadioButton v-model="factory" inputId="f1" name="factory" value="Factory 1" size="small" />
                            <label for="f1">Factory 1</label>
                          </div>
                          <div class="flex items-center gap-2">
                            <RadioButton v-model="factory" inputId="f2" name="factory" value="Factory 2" size="small" />
                            <label for="f2">Factory 2</label>
                          </div>
                          <div class="flex items-center gap-2">
                            <RadioButton v-model="factory" inputId="f3" name="factory" value="Factory 3" size="small" />
                            <label for="f3">Factory 3</label>
                          </div>
                          <div class="flex items-center gap-2">
                            <RadioButton v-model="factory" inputId="f4" name="factory" value="Factory 4" size="small" />
                            <label for="f4">Factory 4</label>
                          </div>
                          <div class="flex items-center gap-2">
                            <RadioButton v-model="factory" inputId="subpro" name="factory" value="Subproduction" size="small" />
                            <label for="subpro">Subproduction</label>
                          </div>
                        </div>
                        <div class="flex items-center gap-2 text-xs border border-slate-400 rounded-lg px-3 py-2">
                          <div class="flex items-center gap-2">
                            <RadioButton v-model="status" inputId="solved" name="status" value="Solved" size="small" />
                            <label for="solved">Solved</label>
                          </div>
                          <div class="flex items-center gap-2">
                            <RadioButton v-model="status" inputId="pending" name="status" value="Pending" size="small" />
                            <label for="pending">Pending</label>
                          </div>
                        </div>
                      </div>
                      <h1 class="text-[0.6rem] text-red-400">*: <i>You can edit one of them, or none at all.</i></h1>
                    </section>
                    <template #footer>
                      <button @click="clearField()" class="flex items-center gap-1.5 text-xs bg-slate-200 text-slate-50 py-2 px-3 rounded-md hover:cursor-pointer">
                        <p class="text-[0.6rem] text-slate-900">Cancel</p>
                      </button>
                      <button @click="update(feeds[contentOf].id)" class="flex items-center gap-1.5 text-xs bg-slate-700 text-slate-50 py-2 px-3 rounded-md hover:cursor-pointer">
                        <p class="text-[0.6rem]">Edit</p>
                      </button>
                    </template>
                  </Dialog>
                </template>
              </Card>
            </section>
            <Paginator v-model:first="contentOf" :rows="1" :totalRecords="feeds.length" template="PrevPageLink CurrentPageReport NextPageLink" class="text-[0.7rem]" />
          </section>
          <section class="absolute top-0 right-0">
            <Message v-if="isPostDeleted" size="small" severity="success" variant="solid" :life="3000">Post Deleted.</Message>
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

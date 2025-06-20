<script setup lang="ts">
import { onBeforeMount, reactive, ref } from 'vue';
import { useConfirm } from 'primevue';

import type { FeedOfUserType, FeedUpdateBodyType, UserType, ProfileUpdateBodyType, FetchResultType } from '../types';
import { FeedAPI } from '../composables/feeds';
import { UserAPI } from '../composables/users';
import { generateTimestamp, formateDescription } from '../utils';
import { factoryData } from '../constant';

import Modal from '../components/Modal.vue';
import Footer from '../components/Footer.vue';

enum DialogEnum {
  Post = 'post',
  Profile = 'profile',
}

const contentOf = ref<number>(0);

const feedUpdateRequestBody: FeedUpdateBodyType = reactive({
  title: '',
  description: '',
  factory: {
    name: '',
    code: 'F',
  },
  category: '',
  status: '',
});

const profileUpdateRequestBody: ProfileUpdateBodyType = reactive({
  fullname: '',
  username: '',
  nik: '',
});

const userAPI = new UserAPI();
const feedAPI = new FeedAPI();

const user = ref<UserType | null | undefined>();

const isPostDeleted = ref<FetchResultType>({
  status: true,
  message: '',
});
const isPostUpdated = ref<FetchResultType>({
  status: true,
  message: '',
});
const isProfileUpdated = ref<FetchResultType>({
  status: true,
  message: 'Profile Updated',
});

const showEditPost = ref<boolean>(false);
const showEditProfile = ref<boolean>(false);
const loadingState = ref<boolean>(true);
const transitionName = ref<'slide-left' | 'slide-right'>();

const feeds = ref<FeedOfUserType[]>([
  {
    id: 0,
    title: '',
    description: '',
    factory: '',
    status: '',
    category: '',
    createdAt: '',
    updatedAt: '',
  },
]);

const clearField = (dialog: DialogEnum) => {
  if (dialog == 'post') {
    feedUpdateRequestBody.title = '';
    feedUpdateRequestBody.description = '';
    feedUpdateRequestBody.factory = { name: '', code: '' };
    feedUpdateRequestBody.status = '';

    showEditPost.value = false;
  }
  if (dialog == 'profile') {
    profileUpdateRequestBody.fullname = '';
    profileUpdateRequestBody.username = '';
    profileUpdateRequestBody.nik = '';

    showEditProfile.value = false;
  }
};

const handleUpdateProfile = async () => {
  isProfileUpdated.value = await userAPI.updateUserProfile(profileUpdateRequestBody);
  if (!isProfileUpdated.value.status) {
    setTimeout(() => {
      isProfileUpdated.value.status = true;
    }, 3500);
    return;
  }
  isProfileUpdated.value.status = false;
  setTimeout(() => {
    isProfileUpdated.value.status = true;
  }, 3500);
  clearField(DialogEnum.Profile);
  feedAPI.getFeedUser(feeds);
};

const handleUpdatePost = async (id: number) => {
  isPostUpdated.value = await feedAPI.updateFeedUser(feedUpdateRequestBody, id);
  if (!isPostUpdated.value.status) {
    setTimeout(() => {
      isPostUpdated.value.status = true;
    }, 3500);
    return;
  }
  isPostUpdated.value.status = false;
  setTimeout(() => {
    isPostUpdated.value.status = true;
  }, 3500);
  clearField(DialogEnum.Post);
  feedAPI.getFeedUser(feeds);
};

const handleDeletePost = async (id: number) => {
  isPostDeleted.value = await feedAPI.deleteFeedUser(id);
  if (!isPostDeleted.value.status) {
    setTimeout(() => {
      isPostDeleted.value.status = true;
    }, 3500);
  }
  isPostDeleted.value.status = false;
  setTimeout(() => {
    isPostDeleted.value.status = true;
  }, 3500);
  feedAPI.getFeedUser(feeds);
};

const handleCloseProfileUpdateModal = () => (isProfileUpdated.value.status = true);
const handleClosePostUpdateModal = () => (isPostUpdated.value.status = true);
const handleClosePostDeleteModal = () => (isPostDeleted.value.status = true);

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
      handleDeletePost(feeds.value[contentOf.value].id);
    },
    reject: () => {},
  });
};

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

const items = ref([
  {
    label: 'Edit',
    icon: 'pi pi-pencil',
    command: () => {
      showEditPost.value = true;
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

const next = (callback: (ev: Event) => void, ev: Event) => {
  transitionName.value = 'slide-left';
  callback(ev);
};

const prev = (callback: (ev: Event) => void, ev: Event) => {
  transitionName.value = 'slide-right';
  callback(ev);
};

onBeforeMount(async () => {
  await feedAPI.getFeedUser(feeds);
  user.value = await userAPI.getCurrentUser();
  if (user.value || user.value == null) loadingState.value = false;
});
</script>
<template>
  <div>
    <main class="relative min-h-screen flex flex-col gap-2">
      <header class="flex items-center justify-between bg-white p-5">
        <div class="flex items-center gap-5">
          <button @click="$router.back()">
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
      <section v-if="loadingState">
        <Card>
          <template #content>
            <section class="min-h-screen -mt-5">
              <section class="flex flex-col gap-6 items-center justify-center mt-5">
                <div class="flex items-center gap-5">
                  <Skeleton width="4rem" height="4rem" shape="circle" />
                  <div class="flex flex-col gap-2">
                    <div class="flex flex-col gap-1">
                      <Skeleton width="5rem" height="1.1rem" />
                      <Skeleton width="3rem" height="1rem" />
                    </div>
                  </div>
                </div>
                <div class="flex flex-col gap-3 justify-center items-center">
                  <Skeleton width="3rem" height="3rem" />
                  <Skeleton width="5rem" height="1rem" />
                </div>
              </section>
              <section class="mt-5 flex flex-col gap-5 px-2 justify-center items-center">
                <Skeleton width="3rem" height="1rem" class="self-start" />
                <Skeleton width="17rem" height="13rem" />
              </section>
            </section>
          </template>
        </Card>
      </section>
      <section v-if="!user" class="px-2 bg-white flex flex-col items-center gap-2 h-screen -mt-2 p-50">
        <RouterLink to="/login" class="flex items-center gap-2 text-xs bg-slate-200 text-slate-700 py-3.5 px-4.5 rounded-md hover:cursor-pointer">
          <i class="pi pi-sign-in" style="font-size: 0.8rem" />
          <p class="text-xs">Sign In</p>
        </RouterLink>
      </section>
      <section v-else class="px-2">
        <Card class="relative min-h-screen">
          <template #header>
            <section class="flex flex-col gap-6 items-center justify-center mt-5">
              <div class="flex items-center gap-5">
                <Avatar :label="user?.fullname.charAt(0)" size="xlarge" shape="circle" />
                <div class="flex flex-col gap-2">
                  <div>
                    <p class="poppins-semibold text-[0.95rem]">{{ user?.fullname }}</p>
                    <p class="text-[0.8rem] text-slate-400 -mt-1">@{{ user?.username }}</p>
                  </div>
                  <Dialog v-model:visible="showEditProfile" modal :closable="false" :style="{ width: '20rem' }">
                    <template #header>
                      <h1>Edit Profile</h1>
                    </template>
                    <section class="flex flex-col justify-center items-start gap-3">
                      <h1 class="text-xs">Update your Profile</h1>
                      <div class="flex flex-col justify-center gap-2 w-full">
                        <input v-model="profileUpdateRequestBody.fullname" type="text" id="fullname" placeholder="Name" class="py-2 px-3 border border-slate-400 rounded-lg text-xs focus:outline-slate-400" />
                        <input v-model="profileUpdateRequestBody.username" type="text" id="username" placeholder="Username" class="py-2 px-3 border border-slate-400 rounded-lg text-xs focus:outline-slate-400" />
                        <input v-model="profileUpdateRequestBody.nik" type="text" id="nik" placeholder="NIK" class="py-2 px-3 border border-slate-400 rounded-lg text-xs focus:outline-slate-400" />
                      </div>
                      <h1 class="text-[0.6rem] text-red-400">*: <i>You can edit one of them, or none at all.</i></h1>
                    </section>
                    <template #footer>
                      <button @click="clearField(DialogEnum.Profile)" class="flex items-center gap-1.5 text-xs bg-slate-200 text-slate-50 py-2 px-3 rounded-md hover:cursor-pointer">
                        <p class="text-[0.6rem] text-slate-900">Cancel</p>
                      </button>
                      <button @click="handleUpdateProfile()" class="flex items-center gap-1.5 text-xs bg-slate-700 text-slate-50 py-2 px-3 rounded-md hover:cursor-pointer">
                        <p class="text-[0.6rem]">Edit</p>
                      </button>
                    </template>
                  </Dialog>
                  <button @click="showEditProfile = true" class="flex items-center gap-2 text-xs bg-slate-100 text-slate-700 py-1.5 px-2.5 rounded-md w-24 hover:cursor-pointer">
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
                <Transition v-else :name="transitionName">
                  <Card class="pt-5 px-5" :key="feeds[contentOf].id">
                    <template #header>
                      <section class="flex justify-between items-start">
                        <p class="text-[0.6rem] text-slate-400 mt-1">{{ generateTimestamp(feeds[contentOf].createdAt)[0] }}</p>
                        <div class="relative flex items-start gap-2">
                          <div class="text-[0.1rem] flex gap-1">
                            <span class="text-[0.5rem] text-center px-2 py-1 rounded-md" :class="feeds[contentOf].category == 'Trouble' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'">{{ feeds[contentOf].category }}</span>
                            <span class="text-[0.5rem] text-center bg-slate-100 px-2 py-1 rounded-md">{{ feeds[contentOf].factory }}</span>
                            <span class="text-[0.5rem] text-center px-2 py-1 rounded-md" :class="feeds[contentOf].status == 'Solved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'">
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
                        <p v-if="feeds[contentOf].createdAt !== feeds[contentOf].updatedAt" class="text-[0.5rem] text-slate-400 self-end mt-2">Edited on {{ generateTimestamp(feeds[contentOf].updatedAt)[0] }}</p>
                      </section>
                      <Dialog v-model:visible="showEditPost" modal :closable="false" :style="{ width: '20rem' }">
                        <template #header>
                          <h1>Edit Post</h1>
                        </template>
                        <section class="flex flex-col justify-center items-start gap-3">
                          <h1 class="text-xs">Update your information trouble</h1>
                          <div class="flex flex-col justify-center gap-2 w-full">
                            <input v-model="feedUpdateRequestBody.title" type="text" id="title" placeholder="Title" class="py-2 px-3 border border-slate-400 rounded-lg text-xs focus:outline-slate-400" />
                            <textarea v-model="feedUpdateRequestBody.description" id="desc" placeholder="Description" class="h-28 text-xs border border-slate-400 py-2 px-3 rounded-lg resize-none focus:outline-slate-400" />
                            <Select v-model="feedUpdateRequestBody.factory" :options="factoryData" optionLabel="name" placeholder="Select a Factory" class="mb-1 w-48" size="small" :labelStyle="{ fontSize: '0.65rem' }">
                              <template #value="slotProps">
                                <div v-if="slotProps.value.name != ''" class="flex items-center">
                                  <div>{{ slotProps.value.name }}</div>
                                </div>
                                <span v-else>
                                  {{ slotProps.placeholder }}
                                </span>
                              </template>
                              <template #option="slotProps">
                                <div class="flex items-center">
                                  <div class="text-[0.7rem]">{{ slotProps.option.name }}</div>
                                </div>
                              </template>
                              <template #dropdownicon>
                                <i class="pi pi-warehouse" style="font-size: 0.8rem" />
                              </template>
                            </Select>
                            <div class="flex flex-wrap gap-4 text-xs mb-1">
                              <div class="flex items-center gap-2">
                                <RadioButton v-model="feedUpdateRequestBody.category" inputId="trouble" name="category" value="Trouble" size="small" />
                                <label for="trouble" class="text-[0.6rem]">Trouble</label>
                              </div>
                              <div class="flex items-center gap-2">
                                <RadioButton v-model="feedUpdateRequestBody.category" inputId="improve" name="category" value="Improvement" size="small" />
                                <label for="improve" class="text-[0.6rem]">Improvement</label>
                              </div>
                            </div>
                            <div class="flex flex-wrap gap-5 text-xs">
                              <div class="flex items-center gap-2">
                                <RadioButton v-model="feedUpdateRequestBody.status" inputId="solved" name="status" value="Solved" size="small" />
                                <label for="solved" class="text-[0.6rem]">Solved</label>
                              </div>
                              <div class="flex items-center gap-2">
                                <RadioButton v-model="feedUpdateRequestBody.status" inputId="pending" name="status" value="Pending" size="small" />
                                <label for="pending" class="text-[0.6rem]">Pending</label>
                              </div>
                            </div>
                          </div>
                          <h1 class="text-[0.6rem] text-red-400">*: <i>You can edit one of them, or none at all.</i></h1>
                        </section>
                        <template #footer>
                          <button @click="clearField(DialogEnum.Post)" class="flex items-center gap-1.5 text-xs bg-slate-200 text-slate-50 py-2 px-3 rounded-md hover:cursor-pointer">
                            <p class="text-[0.6rem] text-slate-900">Cancel</p>
                          </button>
                          <button @click="handleUpdatePost(feeds[contentOf].id)" class="flex items-center gap-1.5 text-xs bg-slate-700 text-slate-50 py-2 px-3 rounded-md hover:cursor-pointer">
                            <p class="text-[0.6rem]">Edit</p>
                          </button>
                        </template>
                      </Dialog>
                    </template>
                  </Card>
                </Transition>
              </section>
              <Paginator v-model:first="contentOf" :rows="1" :totalRecords="feeds.length" template="PrevPageLink CurrentPageReport NextPageLink" class="text-[0.7rem]">
                <template #container="{ page, pageCount, prevPageCallback, nextPageCallback }">
                  <div class="flex items-center gap-4 justify-center">
                    <button @click="prev(prevPageCallback, $event)" :disabled="page === 0">
                      <i class="pi pi-chevron-left" style="font-size: 0.7rem" />
                    </button>
                    <div class="text-color text-[0.6rem]">
                      <span class="block sm:hidden">{{ page + 1 }} of {{ pageCount }}</span>
                    </div>
                    <button @click="next(nextPageCallback, $event)" :disabled="page === pageCount! - 1">
                      <i class="pi pi-chevron-right" style="font-size: 0.7rem" />
                    </button>
                  </div>
                </template>
              </Paginator>
            </section>
          </template>
        </Card>
      </section>
      <TransitionGroup name="slide" mode="out-in" tag="ul" class="absolute top-10 flex flex-col gap-2 right-14">
        <Modal v-if="!isProfileUpdated.status" variant="success" :message="isProfileUpdated.message" @closeModal="handleCloseProfileUpdateModal" key="$1" />
        <Modal v-if="!isPostUpdated.status" variant="success" :message="isPostUpdated.message" @closeModal="handleClosePostUpdateModal" key="$2" />
        <Modal v-if="!isPostDeleted.status" variant="success" :message="isPostDeleted.message" @closeModal="handleClosePostDeleteModal" key="$3" />
      </TransitionGroup>
    </main>
    <Footer />
  </div>
</template>

<style scoped></style>

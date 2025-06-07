<script setup lang="ts">
import { reactive, ref } from 'vue';
import { PasswordAPI } from '../composables/password';
import type { FetchResultType } from '../types';

import Modal from '../components/Modal.vue';

const passwordAPI = new PasswordAPI();

const userBodyRequest: { user: string; password: string } = reactive({
  user: '',
  password: '',
});

const newPassword = ref<string>('');
const isAllowedModal = ref<boolean>(true);
const isAllowed = ref<FetchResultType>({
  status: false,
  message: '',
});
const isPwUpdated = ref<FetchResultType>({
  status: true,
  message: '',
});

const handleFindUser = async () => {
  isAllowed.value = await passwordAPI.findUser({ user: userBodyRequest.user });
  if (!isAllowed.value.status) {
    isAllowedModal.value = false;
    setTimeout(() => {
      isAllowedModal.value = true;
    }, 3500);
  }
};

const handleUpdatePw = async () => {
  isPwUpdated.value = await passwordAPI.changePassword(userBodyRequest);
  if (!isPwUpdated.value.status) {
    isPwUpdated.value.status = false;
    setTimeout(() => {
      isPwUpdated.value.status = true;
    }, 3500);
  }
};

const handleCloseAllowedModal = () => {
  isAllowedModal.value = true;
};
const handleCloseUpdatedModal = () => {
  isPwUpdated.value.status = true
}
</script>

<template>
  <main class="relative flex justify-center items-center mt-10">
    <Card class="flex justify-center max-w-lg p-6">
      <template #header>
        <h1>Password Recovery</h1>
        <Divider />
      </template>

      <template #content>
        <section class="flex flex-col gap-2">
          <div v-focustrap class="w-full sm:w-80 flex flex-col gap-4 text-xs -mt-4">
            <div class="flex flex-col gap-2">
              <p class="text-sm">Find your account</p>
              <IconField>
                <InputIcon>
                  <i class="pi pi-user" style="font-size: 0.8rem" />
                </InputIcon>
                <InputText id="input" :disabled="isAllowed.status" v-model="userBodyRequest.user" type="text" placeholder="Username or NIK" fluid size="small"/>                                                                                     
              </IconField>
              <button @click="handleFindUser()" :disabled="isAllowed.status" type="submit" class="flex items-center justify-center self-end gap-2 mt-2 py-2 rounded-lg w-16 bg-slate-700 text-slate-50 disabled:bg-slate-400 disabled:cursor-not-allowed hover:cursor-pointer hover:bg-slate-800">
                <i class="pi pi-search" style="font-size: 0.7rem"></i>
                <p class="text-xs">Find</p>
              </button>
            </div>

            <Divider />

            <IconField>
              <InputIcon>
                <i class="pi pi-lock" style="font-size: 0.8rem" />
              </InputIcon>
              <Password id="password" v-model="newPassword" :feedback="false" placeholder="New Password" toggleMask fluid size="small" class="text-xs" type="password" :disabled="!isAllowed.status" />
            </IconField>
            <IconField>
              <InputIcon>
                <i class="pi pi-lock" style="font-size: 0.8rem" />
              </InputIcon>
              <Password id="password" v-model="userBodyRequest.password" :feedback="false" placeholder="Re-type Password" toggleMask fluid size="small" class="text-xs" type="password" :disabled="!isAllowed.status" />
            </IconField>

            <button
              @click="handleUpdatePw()"
              :disabled="!isAllowed.status"
              type="submit"
              class="flex items-center justify-center gap-3 mt-2 py-2.5 rounded-lg bg-slate-700 text-slate-50 hover:cursor-pointer hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              <i class="pi pi-pencil" style="font-size: 0.8rem"></i>
              <p class="text-xs">Set Password</p>
            </button>
          </div>
          <p class="text-xs">Remember your password? <RouterLink to="/login" class="poppins-bold underline">Login here</RouterLink></p>
        </section>
      </template>
    </Card>
    <TransitionGroup name="slide" mode="out-in" tag="ul" class="absolute top-2 flex flex-col gap-2 right-14">
      <Modal v-if="!isAllowedModal" variant="error" :message="isAllowed.message" @closeModal="handleCloseAllowedModal" icon="pi pi-times" key="$1" />
      <Modal v-if="!isPwUpdated.status" variant="error" :message="isPwUpdated.message" @closeModal="handleCloseUpdatedModal" icon="pi pi-times" key="$2" />
    </TransitionGroup>
  </main>
</template>

<style scoped></style>

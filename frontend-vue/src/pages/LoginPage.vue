<script setup lang="ts">
import { reactive, ref } from 'vue';
import { UserAPI } from '../composables/users';
import { type FetchResultType, type UserLoginRequestBody } from '../types';

import Modal from '../components/Modal.vue';

const userAPI = new UserAPI();
const userBodyRequest: UserLoginRequestBody = reactive({
  user: '',
  password: ''
})

const showModal = ref<FetchResultType>({
  status: true,
  message: ''
})

const handleUserLogin = async () => {
  showModal.value = await userAPI.userLogin(userBodyRequest);
  if(!showModal.value.status) {
    setTimeout(() => {
      showModal.value.status = true
    }, 3500);
  }
};

const handleCloseModal = () => showModal.value.status = true;
</script>

<template>
  <main class="relative flex justify-center items-center mt-10">
    <Card class="flex justify-center max-w-lg p-6">
      <template #header>
        <h1>User Login</h1>
        <Divider />
      </template>

      <template #content>
        <section class="flex flex-col gap-2">
          <div v-focustrap class="w-full sm:w-80 flex flex-col gap-4 text-xs -mt-4">
            <IconField>
              <InputIcon>
                <i class="pi pi-user" style="font-size: 0.8rem" />
              </InputIcon>
              <InputText id="input" v-model="userBodyRequest.user" type="text" placeholder="Username or NIK" fluid size="small" />
            </IconField>
            <IconField>
              <InputIcon>
                <i class="pi pi-lock" style="font-size: 0.8rem" />
              </InputIcon>
              <Password id="password" v-model="userBodyRequest.password" :feedback="false" placeholder="Password" toggleMask fluid size="small" class="text-xs" type="password" />
            </IconField>

            <RouterLink to="/forgot" class="poppins-bold underline">Forgot password?</RouterLink>

            <button @click="handleUserLogin()" type="submit" class="flex items-center justify-center gap-3 mt-2 py-2.5 rounded-lg bg-slate-700 text-slate-50 hover:cursor-pointer hover:bg-slate-800">
              <i class="pi pi-sign-in" style="font-size: 0.8rem"></i>
              <p class="text-xs">Sign In</p>
            </button>
          </div>
          <p class="text-xs">Don't have an account? <RouterLink to="/register" class="poppins-bold underline">Register here</RouterLink></p>
        </section>
      </template>
    </Card>
    <TransitionGroup name="slide" mode="out-in" tag="ul" class="absolute top-2 flex flex-col gap-2 right-14">
      <Modal v-if="!showModal.status" variant="error" :message="showModal.message" @closeModal="handleCloseModal" icon="pi pi-times" key="$1" />
    </TransitionGroup>
  </main>
</template>

<style scoped>
</style>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { UserAPI } from '../composables/users';
import { type FetchResultType, type UserRegistRequestBody } from '../types';

import Modal from '../components/Modal.vue';

const userAPI = new UserAPI();

const userRegistRequest: UserRegistRequestBody = reactive({
  username: '',
  fullname: '',
  nik: '',
  password: ''
})

const showModal = ref<FetchResultType>({
  status: true,
  message: ''
})

const handleUserRegist = async () => {
  showModal.value = await userAPI.userRegistration(userRegistRequest);
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
        <h1>User Registration</h1>
        <Divider />
      </template>

      <template #content>
        <section class="flex flex-col gap-2 -mt-3">
          <div class="w-full sm:w-80 flex flex-col gap-3 text-xs">
            <IconField>
              <InputIcon>
                <i class="pi pi-user" style="font-size: 0.8rem" />
              </InputIcon>
              <InputText id="input" v-model="userRegistRequest.fullname" type="text" placeholder="Name" fluid size="small" />
            </IconField>

            <IconField>
              <InputIcon>
                <i class="pi pi-at" style="font-size: 0.8rem" />
              </InputIcon>
              <InputText id="username" v-model="userRegistRequest.username" type="text" placeholder="Username" fluid size="small" />
            </IconField>

            <IconField>
              <InputIcon>
                <i class="pi pi-id-card" style="font-size: 0.8rem" />
              </InputIcon>
              <InputText id="nik" v-model="userRegistRequest.nik" type="text" placeholder="NIK" fluid size="small" />
            </IconField>

            <IconField>
              <InputIcon>
                <i class="pi pi-lock" style="font-size: 0.8rem" />
              </InputIcon>
              <Password id="password" v-model="userRegistRequest.password" :feedback="false" placeholder="Password" toggleMask fluid size="small" class="text-xs" type="password" />
            </IconField>

            <button type="submit" class="flex items-center justify-center gap-3 mt-2 py-2.5 rounded-lg bg-slate-700 text-slate-50 hover:cursor-pointer hover:bg-slate-800" @click="handleUserRegist()">
              <i class="pi pi-user-plus" style="font-size: 0.8rem"></i>
              <p class="text-xs">Register</p>
            </button>
          </div>
          <p class="text-xs">Already have account? <RouterLink to="/login" class="poppins-bold underline">Login here</RouterLink></p>
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

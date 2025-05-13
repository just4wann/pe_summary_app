<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue';
import { UserAPI } from '../composables';
import type { UserRegistRequestBody } from '../types';

const toast = useToast();
const router = useRouter();

const userAPI = new UserAPI(toast);

const username = ref<string>('');
const fullname = ref<string>('');
const nik = ref<string>('');
const password = ref<string>('');
const accept = ref<boolean>(false);

const regist = async () => {
  const body: UserRegistRequestBody = {
    username: username.value,
    fullname: fullname.value,
    nik: nik.value,
    password: password.value,
  };

  await userAPI.userRegistration(body, router);
};
</script>

<template>
  <main class="flex justify-center items-center mt-10">
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
              <InputText id="input" v-model="fullname" type="text" placeholder="Name" fluid size="small" />
            </IconField>

            <IconField>
              <InputIcon>
                <i class="pi pi-at" style="font-size: 0.8rem" />
              </InputIcon>
              <InputText id="username" v-model="username" type="text" placeholder="Username" fluid size="small" />
            </IconField>

            <IconField>
              <InputIcon>
                <i class="pi pi-id-card" style="font-size: 0.8rem" />
              </InputIcon>
              <InputText id="nik" v-model="nik" type="text" placeholder="NIK" fluid size="small" />
            </IconField>

            <IconField>
              <InputIcon>
                <i class="pi pi-lock" style="font-size: 0.8rem" />
              </InputIcon>
              <Password id="password" v-model="password" :feedback="false" placeholder="Password" toggleMask fluid size="small" class="text-xs" type="password" />
            </IconField>

            <div class="flex items-center gap-2">
              <Checkbox id="accept" v-model="accept" name="accept" value="Accept" size="small" />
              <label for="accept">I agree to the terms and conditions.</label>
            </div>

            <button type="submit" class="flex items-center justify-center gap-3 mt-2 py-2.5 rounded-lg bg-slate-700 text-slate-50 hover:cursor-pointer hover:bg-slate-800" @click="regist()">
              <i class="pi pi-user-plus" style="font-size: 0.8rem;"></i>
              <p class="text-xs ">Register</p>
            </button>
          </div>
          <p class="text-xs">Already have account? <RouterLink to="/login" class="poppins-bold underline">Login here</RouterLink></p>
        </section>

        <Toast />
      </template>
    </Card>
  </main>
</template>

<style scoped></style>

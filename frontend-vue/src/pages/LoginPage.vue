<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue';
import { UserAPI } from '../composables';
import type { UserLoginRequestBody } from '../types';

const toast = useToast();
const router = useRouter();

const userAPI = new UserAPI(toast);
const user = ref<string>('');
const password = ref<string>('');

const login = async () => {
  const body: UserLoginRequestBody = {
    user: user.value,
    password: password.value,
  };

  await userAPI.userLogin(body, router);
};
</script>

<template>
  <main class="flex justify-center items-center mt-10">
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
              <InputText id="input" v-model="user" type="text" placeholder="Username or NIK" fluid size="small" />
            </IconField>
            <IconField>
              <InputIcon>
                <i class="pi pi-lock" style="font-size: 0.8rem" />
              </InputIcon>
              <Password id="password" v-model="password" :feedback="false" placeholder="Password" toggleMask fluid size="small" class="text-xs" type="password" />
            </IconField>

            <RouterLink to="/forgot" class="poppins-bold underline">Forgot password?</RouterLink>

            <button type="submit" class="flex items-center justify-center gap-3 mt-2 py-2.5 rounded-lg bg-slate-700 text-slate-50 hover:cursor-pointer hover:bg-slate-800" @click="login()">
              <i class="pi pi-sign-in" style="font-size: 0.8rem;"></i>
              <p class="text-xs ">Sign In</p>
            </button>
          </div>
          <p class="text-xs">Don't have an account? <RouterLink to="/register" class="poppins-bold underline">Register here</RouterLink></p>
        </section>

        <Toast />
      </template>
    </Card>
  </main>
</template>

<style scoped></style>

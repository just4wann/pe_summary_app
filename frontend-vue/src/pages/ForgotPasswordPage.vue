<script setup lang="ts">
import { ref } from 'vue';
import { PasswordAPI } from '../composables/password';

const passwordAPI = new PasswordAPI();

const user = ref<string>('');
const newPassword = ref<string>('');
const reTypePassword = ref<string>('');
const isAllowed = ref<boolean>(false);

const find = async () => {
  const reqBody: { user: string } = {
    user: user.value,
  };
  isAllowed.value = await passwordAPI.findUser(reqBody);
};

const change = async () => {
  const reqBody: { user: string; password: string } = {
    user: user.value,
    password: reTypePassword.value,
  };
  await passwordAPI.changePassword(reqBody);
};
</script>

<template>
  <main class="flex justify-center items-center mt-10">
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
                <InputText id="input" v-model="user" type="text" placeholder="Username or NIK" fluid size="small" />
              </IconField>
              <button @click="find()" type="submit" class="flex items-center justify-center self-end gap-2 mt-2 py-2 rounded-lg w-16 bg-slate-700 text-slate-50 hover:cursor-pointer hover:bg-slate-800">
                <i class="pi pi-search" style="font-size: 0.7rem"></i>
                <p class="text-xs">Find</p>
              </button>
            </div>

            <Divider />

            <IconField>
              <InputIcon>
                <i class="pi pi-lock" style="font-size: 0.8rem" />
              </InputIcon>
              <Password id="password" v-model="newPassword" :feedback="false" placeholder="New Password" toggleMask fluid size="small" class="text-xs" type="password" :disabled="!isAllowed" />
            </IconField>
            <IconField>
              <InputIcon>
                <i class="pi pi-lock" style="font-size: 0.8rem" />
              </InputIcon>
              <Password id="password" v-model="reTypePassword" :feedback="false" placeholder="Re-type Password" toggleMask fluid size="small" class="text-xs" type="password" :disabled="!isAllowed" />
            </IconField>

            <button
              @click="change()"
              :disabled="!isAllowed"
              type="submit"
              class="flex items-center justify-center gap-3 mt-2 py-2.5 rounded-lg bg-slate-700 text-slate-50 hover:cursor-pointer hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              <i class="pi pi-pencil" style="font-size: 0.8rem"></i>
              <p class="text-xs">Set Password</p>
            </button>
          </div>
          <p class="text-xs">Remember your password? <RouterLink to="/login" class="poppins-bold underline">Login here</RouterLink></p>
        </section>
        <Toast />
      </template>
    </Card>
  </main>
</template>

<style scoped>
</style>

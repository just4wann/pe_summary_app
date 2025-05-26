import type { Ref } from 'vue';
import { useRouter, type Router } from 'vue-router';
import { useToast, type ToastServiceMethods } from 'primevue';
import type { UserType, UserRegistRequestBody, UserLoginRequestBody } from '../types';

export class UserAPI {
  private router: Router;
  private toast: ToastServiceMethods;
  constructor() {
    this.router = useRouter();
    this.toast = useToast();
  }
  public async userRegistration(requestBody: UserRegistRequestBody) {
    try {
      const res = await fetch(import.meta.env.VITE_API_USER_REGISTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      const result = await res.json();
      if (result.statusCode != 200) {
        this.toast.add({ severity: 'error', summary: 'Error', detail: result.message, life: 3000 });
        return;
      }
      this.toast.add({ severity: 'success', summary: 'Registration Success', detail: 'Your account registration success', life: 3000 });
      this.router.push('/login');
    } catch (error) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
    }
  }
  public async userLogin(requestBody: UserLoginRequestBody) {
    try {
      const res = await fetch(import.meta.env.VITE_API_USER_LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });
      const result = await res.json();
      if (result.statusCode != 200) {
        this.toast.add({ severity: 'error', summary: 'Error', detail: result.message, life: 3000 });
        return;
      }
      this.toast.add({ severity: 'success', summary: 'Login Success', detail: 'Your account login success', life: 3000 });
      this.router.push('/');
    } catch (error) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
    }
  }

  public async userLogout(): Promise<boolean> {
    try {
      const res = await fetch(import.meta.env.VITE_API_USER_LOGOUT_URL, {
        method: 'POST',
        credentials: 'include'
      })

      const result = await res.json();
      if (result.statusCode !== 200) return false;
      this.router.push('/');
      return true;
    } catch (error) {
      return false;
    }
  }

  public async getCurrentUser(): Promise<UserType | null> {
    try {
      const res = await fetch(import.meta.env.VITE_API_GET_USER_URL, {
        method: 'GET',
        credentials: 'include',
      });
      const result = await res.json();
      if (result.statusCode != 200) {
        this.toast.add({ severity: 'error', summary: 'Error', detail: result.message, life: 3000 });
        return null;
      }
      return result.data;
    } catch (error) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
      return null;
    }
  }

  public async getAllUser(users: Ref<UserType[]>) {
    try {
      const res = await fetch(import.meta.env.VITE_API_GET_USER_ALL_URL, {
        method: 'GET',
      });
      const result = await res.json();
      for (let i in result.data) {
        users.value.unshift(result.data[i]);
      }
    } catch (error) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
    }
  }
}
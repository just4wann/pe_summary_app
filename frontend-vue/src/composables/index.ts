import type { Ref } from 'vue';
import type { Router } from 'vue-router';
import type { ToastServiceMethods } from 'primevue';
import type { UserType, FeedType, FeedBodyType, ClearValueType, UserRegistRequestBody, UserLoginRequestBody, FeedOfUserType } from '../types';

export class Function {
  public static useClear<T extends keyof ClearValueType>(value: ClearValueType, fields: T[]) {
    fields.forEach((field) => {
      if (typeof value[field] == 'string') {
        value[field] = '' as ClearValueType[T];
      } else if (typeof value[field] == 'object') {
        value[field]['name'] = '';
        value[field]['code'] = '';
      }
    });
  }
}

export class FeedAPI {
  constructor(private toast: ToastServiceMethods) {}
  public async getAllFeed(feeds: Ref<FeedType[]>) {
    try {
      const res = await fetch(import.meta.env.VITE_API_GET_FEED_ALL_URL, {
        method: 'GET',
      });
      const result = await res.json();
      for (let i in result.data) {
        feeds.value.unshift(result.data[i]);
      }
    } catch (error) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
    }
  }

  public async postFeed(feedBody: FeedBodyType): Promise<boolean> {
    try {
      const res = await fetch(import.meta.env.VITE_API_POST_FEED_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(feedBody),
      });
      const result = await res.json();
      if (result.statusCode != 200) {
        this.toast.add({ severity: 'error', summary: 'Error', detail: result.message, life: 3000 });
        return false;
      }
      this.toast.add({ severity: 'success', summary: 'Post Uploaded', detail: 'Your post has been added to feed', life: 3000 });
      return true;
    } catch (error) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
      return false;
    }
  }

  public async getFeedUser(feeds: Ref<FeedOfUserType[]>) {
    try {
      const res = await fetch(import.meta.env.VITE_API_GET_FEED_USER_URL, {
        method: 'GET',
        credentials: 'include',
      });
      const result = await res.json();
      if (result.statusCode != 200) {
        this.toast.add({ severity: 'error', summary: 'Error', detail: result.message, life: 3000 });
        return;
      }
      for (let i in result.data) {
        feeds.value.unshift(result.data[i])
      }
    } catch (error) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
      return;
    }
  }
}

export class UserAPI {
  constructor(private toast: ToastServiceMethods) {}
  public async userRegistration(requestBody: UserRegistRequestBody, router: Router) {
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
      router.push('/login');
    } catch (error) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
    }
  }
  public async userLogin(requestBody: UserLoginRequestBody, router: Router) {
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
      router.push('/');
    } catch (error) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
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

export class PasswordAPI {
  constructor(private toast: ToastServiceMethods) {}

  public async findUser(userInfo: { user: string }): Promise<boolean> {
    try {
      const res = await fetch(import.meta.env.VITE_API_FIND_USER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
      });
      const result = await res.json();
      if (result.statusCode !== 200) {
        this.toast.add({ severity: 'error', summary: 'Error', detail: result.message, life: 3000 });
        return false;
      }
      return true;
    } catch (error) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
      return false;
    }
  }

  public async changePassword(newPassword: { user: string; password: string }): Promise<boolean> {
    try {
      const res = await fetch(import.meta.env.VITE_API_CHANGE_PASSWORD_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPassword),
      });
      const result = await res.json();
      if (result.statusCode !== 200) {
        this.toast.add({ severity: 'error', summary: 'Error', detail: result.message, life: 3000 });
        return false;
      }
      return true;
    } catch (error) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
      return false;
    }
  }
}

import { useToast, type ToastServiceMethods } from 'primevue';
import { useRouter, type Router } from 'vue-router';

export class PasswordAPI {
  private toast: ToastServiceMethods;
  private router: Router;
  constructor() {
    this.toast = useToast();
    this.router = useRouter();
  }

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
      this.router.push('/login');
      return true;
    } catch (error) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
      return false;
    }
  }
}
import { useRouter, type Router } from 'vue-router';
import type { FetchResponseType, FetchResultType } from '../types';

export class PasswordAPI {
  private router: Router;
  constructor() {
    this.router = useRouter();
  }

  public async findUser<T>(userInfo: { user: string }): Promise<FetchResultType> {
    try {
      const res = await fetch(import.meta.env.VITE_API_FIND_USER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userInfo),
      });
      const result: FetchResponseType<T> = await res.json();
      if (result.statusCode !== 200) {
        return {
          status: false,
          message: result.message,
        };
      }
      return {
        status: true,
        message: result.message,
      };
    } catch (error) {
      return {
        status: false,
        message: error,
      };
    }
  }

  public async changePassword<T>(newPassword: { user: string; password: string }): Promise<FetchResultType> {
    try {
      const res = await fetch(import.meta.env.VITE_API_CHANGE_PASSWORD_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPassword),
      });
      const result: FetchResponseType<T> = await res.json();
      if (result.statusCode !== 200) {
        return {
          status: false,
          message: result.message,
        };
      }
      this.router.push('/login');
      return {
        status: true,
        message: result.message,
      };
    } catch (error) {
      return {
        status: false,
        message: error,
      };
    }
  }
}

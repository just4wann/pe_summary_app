import type { Ref } from 'vue';
import { useRouter, type Router } from 'vue-router';
import type { UserType, UserRegistRequestBody, UserLoginRequestBody, ProfileUpdateBodyType, FetchResultType, FetchResponseType } from '../types';

export class UserAPI {
  private router: Router;
  constructor() {
    this.router = useRouter();
  }
  public async userRegistration<T>(requestBody: UserRegistRequestBody): Promise<FetchResultType> {
    try {
      const res = await fetch(import.meta.env.VITE_API_USER_REGISTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      const result: FetchResponseType<T> = await res.json();
      if (result.statusCode != 200) {
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
  public async userLogin<T>(requestBody: UserLoginRequestBody): Promise<FetchResultType> {
    try {
      const res = await fetch(import.meta.env.VITE_API_USER_LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      });
      const result: FetchResponseType<T> = await res.json();
      if (result.statusCode != 200) {
        return {
          status: false,
          message: result.message,
        };
      }
      this.router.push({
        name: 'home',
        params: {
          id: 'main'
        }
      });
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

  public async userLogout<T>(): Promise<FetchResultType> {
    try {
      const res = await fetch(import.meta.env.VITE_API_USER_LOGOUT_URL, {
        method: 'POST',
        credentials: 'include',
      });

      const result: FetchResponseType<T> = await res.json();
      if (result.statusCode != 200) {
        return {
          status: false,
          message: result.message,
        };
      }
      this.router.push({
        name: 'home',
        params: {
          id: 'main'
        }
      });
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

  public async getCurrentUser(): Promise<UserType | null> {
    try {
      const res = await fetch(import.meta.env.VITE_API_GET_USER_URL, {
        method: 'GET',
        credentials: 'include',
      });
      const result: FetchResponseType<UserType | null> = await res.json();
      if (result.statusCode != 200) {
        return null;
      }
      return result.data;
    } catch (error) {
      return null;
    }
  }

  public async getAllUser(users: Ref<UserType[]>) {
    try {
      const res = await fetch(import.meta.env.VITE_API_GET_USER_ALL_URL, {
        method: 'GET',
      });
      const result: FetchResponseType<UserType[]> = await res.json();
      for (let i in result.data) {
        users.value.unshift(result.data[i]);
      }
    } catch (error) {}
  }

  public async updateUserProfile<T>(data: ProfileUpdateBodyType): Promise<FetchResultType> {
    try {
      const res = await fetch(import.meta.env.VITE_API_UPDATE_USER_PROFILE_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
      });

      const result: FetchResponseType<T> = await res.json();
      if (result.statusCode != 200) {
        return {
          status: false,
          message: result.data,
        };
      }
      return {
        status: true,
        message: result.data,
      };
    } catch (error) {
      return {
        status: false,
        message: error,
      };
    }
  }
}

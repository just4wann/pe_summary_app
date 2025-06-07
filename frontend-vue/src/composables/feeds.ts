import type { Ref } from 'vue';
import type { FeedType, FeedBodyType, FeedOfUserType, FeedUpdateBodyType, FetchResultType, FetchResponseType } from '../types';
import { useRouter, type Router } from 'vue-router';

export class FeedAPI {
  private router: Router;
  constructor() {
    this.router = useRouter();
  }
  public async getAllFeed(feeds: Ref<FeedType[]>): Promise<FetchResultType> {
    feeds.value = []
    try {
      const res = await fetch(import.meta.env.VITE_API_GET_FEED_ALL_URL, {
        method: 'GET',
      });
      const result: FetchResponseType<FeedType[]> = await res.json();
      if (result.statusCode !== 200) {
        return {
          status: false,
          message: result.message,
        };
      }
      for (let i in result.data) {
        feeds.value.unshift(result.data[i]);
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

  public async postFeed<T>(feedBody: FeedBodyType): Promise<FetchResultType> {
    try {
      const res = await fetch(import.meta.env.VITE_API_POST_FEED_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(feedBody),
      });
      const result: FetchResponseType<T> = await res.json();
      if (result.statusCode !== 200) {
        return {
          status: false,
          message: result.message,
        };
      }
      this.router.push({
        name: 'home',
        params: {
          id: 'posted'
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

  public async getFeedUser(feeds: Ref<FeedOfUserType[]>) {
    feeds.value = [];
    try {
      const res = await fetch(import.meta.env.VITE_API_GET_FEED_USER_URL, {
        method: 'GET',
        credentials: 'include',
      });
      const result = await res.json();
      if (result.statusCode != 200) {
        return;
      }
      for (let i in result.data) {
        feeds.value.unshift(result.data[i]);
      }
    } catch (error) {
      return;
    }
  }

  public async updateFeedUser<T>(updateData: FeedUpdateBodyType, feedId: number): Promise<FetchResultType> {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_UPDATE_FEED_URL}/${feedId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
        credentials: 'include',
      });

      const result: FetchResponseType<T> = await res.json();
      if (result.statusCode !== 200) {
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

  public async deleteFeedUser<T>(feedId: number): Promise<FetchResultType> {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_DELETE_FEED_URL}/${feedId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const result: FetchResponseType<T> = await res.json();
      if (result.statusCode !== 200) {
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

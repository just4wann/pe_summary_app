import type { Ref } from 'vue';
import { useToast, type ToastServiceMethods } from 'primevue';
import type { FeedType, FeedBodyType, FeedOfUserType, FeedUpdateBodyType } from '../types';
import { useRouter, type Router } from 'vue-router';

export class FeedAPI {
  private toast: ToastServiceMethods;
  private router: Router;
  constructor() {
    this.toast = useToast();
    this.router = useRouter();
  }
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
      this.router.push('/')
      return true;
    } catch (error) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
      return false;
    }
  }

  public async getFeedUser(feeds: Ref<FeedOfUserType[]>) {
    feeds.value.pop()
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

  public async updateFeedUser(updateData: FeedUpdateBodyType, feedId: number): Promise<boolean> {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_UPDATE_FEED_URL}/${feedId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData),
        credentials: 'include'
      });

      const result = await res.json();
      if (result.statusCode !== 200) {
        this.toast.add({ severity: 'error', summary: 'Error', detail: result.message, life: 3000 });
        return false
      };
      return true; 
    } catch (error) {
      this.toast.add({ severity: 'error', summary: 'Error', detail: error, life: 3000 });
      return false;
    }
  }

  public async deleteFeedUser(feedId: number): Promise<boolean> {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_DELETE_FEED_URL}/${feedId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const result = await res.json();
      if (result.statusCode !== 200) return false;
      return true;
    } catch (error) {
      return false;
    }
  }
}
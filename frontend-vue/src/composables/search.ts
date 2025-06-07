import type { Ref } from 'vue';
import type { FetchResponseType, FetchResultType } from '../types';

export class SearchAPI {
  public async search<T>(query: string, searchResult: Ref<T[]>): Promise<FetchResultType> {
    searchResult.value = [];
    try {
      const res = await fetch(`${import.meta.env.VITE_API_SEARCH_QUERY_URL}?q=${query}`, {
        method: 'GET',
      });
      const result: FetchResponseType<T[]> = await res.json();
      if (result.statusCode !== 200) {
        searchResult.value = [];
        return {
          status: false,
          message: result.message,
        };
      }
      for (let i in result.data) {
        searchResult.value.unshift(result.data[i]);
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
}

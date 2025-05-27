import type { Ref } from "vue";

export class SearchAPI {
    public async search<T>(query: string, searchResult: Ref<T[]>): Promise<boolean> {
        try {
            const res = await fetch(`http://192.168.100.252:3000/api/search?q=${query}`, {
                method: 'GET'
            })
            const result = await res.json();
            if (result.statusCode !== 200) return false;

            for (let i in result.data) {
                searchResult.value.unshift(result.data[i]);
            }
            return true;
        } catch (error) {
            return false
        }
    }
}
import type { FetchResponseType } from "../types";

export default class UploadImageAPI {
  public static async upload(dataImage: FormData): Promise<string[]> {
    try {
      const res = await fetch(import.meta.env.VITE_API_UPLOAD_IMAGE_URL, {
        method: 'POST',
        body: dataImage,
      });
      const result: FetchResponseType<string[]> = await res.json();
      if (result.statusCode !== 200) return [];
      const editedImgUrl: string[] = result.data.map((img: string) => `/src/uploads/${img}`)
      return editedImgUrl;
    } catch (error) {
        return [];
    }
  }
}

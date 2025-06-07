import ResponseError from "@/error/index.js";
import { ResponseBody } from "@/types/index.js";

export default class ImageService {
    public static async upload<K extends string, V>(files?: Express.Multer.File[] | Record<K, V>): Promise<ResponseBody<string[] | string>> {
        if(!files) throw new ResponseError(400, 'No file upload');
        if(!Array.isArray(files)) return {
            statusCode: 200,
            message: 'OK',
            data: 'Image Uploaded'
        }
        const fileNames = files.map((file) => file.filename)
        return {
            statusCode: 200,
            message: 'OK',
            data: fileNames
        }
    }
}
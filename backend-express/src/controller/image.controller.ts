import ImageService from "@/service/image.service.js";
import type { Request, Response, NextFunction } from "express";

export default class ImageController {
    public static async uploadImage(req: Request, res: Response, next: NextFunction) {
        try {
            const response = await ImageService.upload(req.files);
            res.status(response.statusCode).json(response);
        } catch (error) {
            next(error)
        }
    }
}
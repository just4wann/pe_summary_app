import type { Response, Request, NextFunction } from 'express';
import { PostDataRequest } from '@/types/index.js';
import PostService from '@/service/post.service.js';

export default class PostController {
  static async create(req: Request, res: Response, next: NextFunction) {
      try {
        const dataPost = req.body as PostDataRequest;
        const response = await PostService.create(dataPost, req.user!)
        res.status(response.statusCode).json(response)
    } catch (error) {
        next(error)
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
        const response = await PostService.getByUsername(req.user!);
        res.status(response.statusCode).json(response);
    } catch (error) {
        next(error)
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await PostService.getAll();
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error)
    }
  }
}
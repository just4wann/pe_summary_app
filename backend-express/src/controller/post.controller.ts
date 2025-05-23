import type { Response, Request, NextFunction } from 'express';
import { PostDataRequest, PostUpdateRequest } from '@/types/index.js';
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

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const idPostParam = req.params.id;
      const updatedData = req.body as PostUpdateRequest
      const response = await PostService.update(updatedData, idPostParam);
      res.status(response.statusCode).json(response)
    } catch (error) {
      next(error)
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const idPostParam = req.params.id;
      const response = await PostService.delete(idPostParam);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error)
    }
  }
}
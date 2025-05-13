import type { Response, Request, NextFunction } from 'express';
import { PostService, UserService } from '@/service/index.js';
import { RegisterUserRequest, LoginUserRequest, PostDataRequest } from '@/types/index.js';
import jwt from 'jsonwebtoken';

export class UserController {
  static async userRegistration(req: Request, res: Response, next: NextFunction) {
    try {
      const requestBody = req.body as RegisterUserRequest;
      const response = await UserService.register(requestBody);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }
  static async userLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const requestBody = req.body as LoginUserRequest;
      const response = await UserService.login(requestBody);
      const token = jwt.sign({ user: requestBody.user }, process.env.JWT_SECRET_KEY!, { expiresIn: '1h' })
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 3600000
      })
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error);
    }
  }

  static async getAllUser(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await UserService.getAll();
      res.status(response.statusCode).json(response)
    } catch (error) {
      next(error)
    }
  }

  static async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await UserService.get(req.user?.token!)
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error)
    }
  }
}

export class PostController {
  static async create(req: Request, res: Response, next: NextFunction) {
      try {
        const dataPost = req.body as PostDataRequest;
        const response = await PostService.create(dataPost, req.user?.token!)
        res.status(response.statusCode).json(response)
    } catch (error) {
        next(error)
    }
  }

  static async get(req: Request, res: Response, next: NextFunction) {
    try {
        const response = await PostService.getByUsername(req.user?.token!);
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

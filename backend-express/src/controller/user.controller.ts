import type { Response, Request, NextFunction } from 'express';
import UserService from '@/service/user.service.js';
import { RegisterUserRequest, LoginUserRequest, UserProfileUpdateRequest } from '@/types/index.js';
import jwt from 'jsonwebtoken';

export default class UserController {
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

  static async userLogout(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await UserService.logout(req.user!);
      res.clearCookie('token');
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error)
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
  static async userUpdate(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body as UserProfileUpdateRequest
      const response = await UserService.update(req.user!, data);
      res.status(response.statusCode).json(response);
    } catch (error) {
      next(error)
    }
  }
}
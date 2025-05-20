import type { Response, Request, NextFunction } from 'express';
import PasswordService from '@/service/password.service.js';

export default class PasswordController {
    static async findUser(req: Request, res: Response, next: NextFunction) {
      try {
        const userInfo = req.body as { user: string };
        const response = await PasswordService.findUser(userInfo.user);
        res.status(response.statusCode).json(response)
      } catch (error) {
        next(error)
      }
    }
  
    static async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const reqNewPassword = req.body as { user: string, password: string };
      const response = await PasswordService.updatePassword(reqNewPassword.user, reqNewPassword.password);
      res.status(response.statusCode).json(response)
    } catch (error) {
      next(error)
    }
  }
}
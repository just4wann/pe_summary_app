import ResponseError from '@/error/index.js';
import type { Request, Response, NextFunction } from 'express';
import { ValidationError, Op } from 'sequelize';
import User from '@/model/user.model.js';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '@/types/index.js';
import multer, { FileFilterCallback } from 'multer';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authToken = req.cookies.token;
  if (!authToken) {
    res.status(404).json({
      statusCode: 404,
      message: 'No token provided',
    });
    return;
  }

  try {
    const userAccess = jwt.verify(authToken, process.env.JWT_SECRET_KEY!) as JwtPayload;
    const user = await User.findOne({
      where: {
        [Op.or]: [
          {
            username: userAccess.user,
          },
          {
            nik: userAccess.user,
          },
        ],
      },
    });
    if (!user) throw new ResponseError(404, 'User not found');
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      statusCode: 401,
      message: 'Unauthorized',
    });
    return;
  }
}

export function errorMiddleware(error: Error, req: Request, res: Response, next: NextFunction) {
  if (error instanceof ValidationError) {
    res.status(400).json({
      statusCode: 400,
      message: error,
    });
  } else if (error instanceof ResponseError) {
    res.status(error.code).json({
      statusCode: error.code,
      message: error.message,
    });
  } else {
    console.log(error)
    res.status(500).json({
      statusCode: 500,
      message: `Internal Server Error : ${error}`,
    });
  }
}

export const uploadMiddleware = multer({
  storage: multer.diskStorage({
    destination(req, file, callback) {
      callback(null, 'src/uploads');
    },
    filename(req, file, callback) {
      const unique = `${Date.now()}-${file.originalname}`;
      callback(null, unique);
    },
  }),
  fileFilter: (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      callback(new Error('Only .jpg, .png, .pdf files are allowed'));
      return;
    }
    callback(null, true);
  },
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 3
  },
});

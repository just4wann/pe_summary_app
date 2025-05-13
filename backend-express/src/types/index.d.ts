import type { Request } from "express";
import { User, Post } from "@/model/index.ts";

declare global {
    namespace Express {
        interface Request {
            user: User | null
        }
    }
}

export interface ResponseBody<T> {
    statusCode: number;
    message: string;
    data?: T
}

export interface RegisterUserRequest extends Request, User {}

export interface LoginUserRequest extends Request {
    user: string;
    password: string;
}

export interface PostDataRequest extends Request, Post {}

export interface JwtPayload {
    user: string;
    iat: number;
    exp: number
}
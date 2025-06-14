import type { Request } from "express";
import User from "@/model/user.model.ts";
import Post from "@/model/post.model.ts";

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

export interface PostDataRequest extends Request {
    title: string;
    description: string;
    factory: {
        name: string;
        code: string;
    };
    status: string;
    imageUrl: string[];
    category: string;
}

export interface PostUpdateRequest extends Request {
    title?: string;
    description?: string;
    factory?: {
        name?: string;
        code?: string;
    };
    status?: string;
    imageUrl?: string[];
    category?: string;
}

export interface UserProfileUpdateRequest extends Request {
    fullname?: string;
    username?: string;
    nik?: string;
}

export interface JwtPayload {
    user: string;
    iat: number;
    exp: number
}

export interface SearchQuery {
    q?: string;
    user?: string;
    post?: string;
}
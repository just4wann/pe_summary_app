import type { Router } from "express";
import { UserController, PostController } from "@/controller/index.js";
import { authMiddleware } from "@/middleware/index.js";

export class Routes {
    constructor(private publicRouter: Router, private apiRouter: Router) {}

    setupPublicRouter() {
        this.publicRouter.post('/user/regist', UserController.userRegistration);
        this.publicRouter.post('/user/login', UserController.userLogin);

        this.publicRouter.get('/user/getAll', UserController.getAllUser);
        this.publicRouter.get('/post/getAll', PostController.getAll)
    }
    
    setupApiRouter() {
        this.apiRouter.post('/post/add', PostController.create);
        this.apiRouter.get('/post/get', PostController.get);

        this.apiRouter.get('/user', UserController.getUser);
    }
}
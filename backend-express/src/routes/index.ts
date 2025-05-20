import type { Router } from 'express';
import UserController from '@/controller/user.controller.js';
import PostController from '@/controller/post.controller.js';
import PasswordController from '@/controller/password.controller.js';

export class Routes {
  constructor(private publicRouter: Router, private apiRouter: Router) {}

  setupPublicRouter() {
    this.publicRouter.post('/user/regist', UserController.userRegistration);
    this.publicRouter.post('/user/login', UserController.userLogin);

    this.publicRouter.get('/user/getAll', UserController.getAllUser);
    this.publicRouter.get('/post/getAll', PostController.getAll);

    this.publicRouter.post('/password/user', PasswordController.findUser);
    this.publicRouter.post('/password/change', PasswordController.changePassword);
  }

  setupApiRouter() {
    this.apiRouter.post('/post/add', PostController.create);
    this.apiRouter.get('/post/get', PostController.get);

    this.apiRouter.get('/user', UserController.getUser);
    this.apiRouter.post('/user/logout', UserController.userLogout);
  }
}

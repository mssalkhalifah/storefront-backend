import { Express } from 'express';
import UserController from './user.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { createUserValidation, getUserValidation, loginValidation } from './user.schemas';
import { jwtAuthenticator } from '../../middlewares/jwtAuthenticator';

const userRouter = (app: Express): void => {
  app.get('/user/get/:id', jwtAuthenticator, validateRequest(getUserValidation), UserController.getUserById);
  app.get('/user/all', jwtAuthenticator, UserController.getAllUsers);

  app.post('/user/create', validateRequest(createUserValidation), UserController.createUser);
  app.post('/user/login', validateRequest(loginValidation), UserController.login);
  app.post('/user/me', jwtAuthenticator, UserController.getCurrentUser);
  app.post('/user/logout', jwtAuthenticator, UserController.logoutCurrentUser);
};

export default userRouter;

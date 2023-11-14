import express from 'express';
import { UserController } from '../controller/UserController';
import { UserDatabase } from '../database/UserDatabase';
import { UserBusiness } from '../business/UserBusiness';

export const userRouter = express.Router();

const userController = new UserController(new UserBusiness(new UserDatabase()));

// users
userRouter.post('/login', userController.login);
userRouter.post('/signup', userController.signup);

// APENAS PARA AJUDAR A CODIFICAR | NÃO TEM ARQUITETURA APLICADA
userRouter.get('/', userController.getUsers);
userRouter.put('/:id', userController.updateUser);
userRouter.delete('/:id', userController.deleteUser);

// posts

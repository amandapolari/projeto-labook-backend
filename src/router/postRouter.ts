import express from 'express';
import { PostController } from '../controller/PostController';

export const postRouter = express.Router();

const postController = new PostController();

postRouter.get('/', postController.getPosts);
postRouter.post('/', postController.createPost);
postRouter.put('/:id', postController.updatePost);
postRouter.delete('/:id', postController.deletePost);

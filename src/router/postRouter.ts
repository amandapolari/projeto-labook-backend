import express from 'express';
import { PostController } from '../controller/PostController';
import { PostBusiness } from '../business/PostBusiness';
import { PostDatabase } from '../database/PostDatabase';
import { IdGenerator } from '../services/IdGenerator';

export const postRouter = express.Router();

const postController = new PostController(
    new PostBusiness(new PostDatabase(), new IdGenerator())
);

postRouter.get('/', postController.getPosts);
postRouter.post('/', postController.createPost);
postRouter.put('/:id', postController.updatePost);
postRouter.delete('/:id', postController.deletePost);

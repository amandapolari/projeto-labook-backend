import { format } from 'date-fns';
import { Request, Response } from 'express';
import { PostDatabase } from '../database/PostDatabase';
import { TPost } from '../types';
import { Post } from '../models/Post';

export class PostController {
    // GET
    public getPosts = async (req: Request, res: Response) => {
        try {
            const q = req.query.q;

            const postDataBase = new PostDatabase();
            const postsDB = await postDataBase.findPosts(
                q as string | undefined
            );

            const posts: Post[] = postsDB.map((post: TPost) => {
                return new Post(
                    post.id,
                    post.creator_id,
                    post.content,
                    post.likes,
                    post.dislikes,
                    post.created_at,
                    post.updated_at
                );
            });
            // console.log(posts);

            res.status(200).send(posts);
        } catch (error) {
            console.log(error);

            if (req.statusCode === 200) {
                res.status(500);
            }

            if (error instanceof Error) {
                res.send(error.message);
            } else {
                res.send('Erro inesperado');
            }
        }
    };

    // POST
    public createPost = async (req: Request, res: Response) => {
        try {
            const {
                id,
                creatorId,
                content,
                likes,
                dislikes,
                createdAt,
                updatedAt,
            } = req.body;

            if (typeof id !== 'string') {
                res.status(400);
                throw new Error("'id' deve ser string");
            }

            if (typeof creatorId !== 'string') {
                res.status(400);
                throw new Error("'creatorId' deve ser string");
            }

            if (typeof content !== 'string') {
                res.status(400);
                throw new Error("'content' deve ser string");
            }

            if (typeof likes !== 'number') {
                res.status(400);
                throw new Error("'likes' deve ser number");
            }

            if (typeof dislikes !== 'number') {
                res.status(400);
                throw new Error("'dislikes' deve ser number");
            }

            if (typeof createdAt !== 'string') {
                res.status(400);
                throw new Error("'createdAt' deve ser string");
            }

            if (typeof updatedAt !== 'string') {
                res.status(400);
                throw new Error("'updatedAt' deve ser string");
            }

            const postDatabase = new PostDatabase();
            const postDBExists = await postDatabase.findPostById(id);
            const currentDate = new Date();

            if (postDBExists) {
                res.status(400);
                throw new Error("'id' já existe");
            }

            const video = new Post(
                id,
                creatorId,
                content,
                likes,
                dislikes,
                format(currentDate, 'dd-MM-yyyy HH:mm:ss'),
                format(currentDate, 'dd-MM-yyyy HH:mm:ss')
            );

            const newPost: TPost = {
                id: video.getId(),
                creator_id: video.getCreatedId(),
                content: video.getContent(),
                likes: video.getLikes(),
                dislikes: video.getDislikes(),
                created_at: video.getCreatedAt(),
                updated_at: video.getUpdatedAt(),
            };

            await postDatabase.insertPost(newPost);

            res.status(201).send({
                message: 'Post criado com sucesso',
                newPost,
            });
        } catch (error) {
            console.log(error);

            if (req.statusCode === 200) {
                res.status(500);
            }

            if (error instanceof Error) {
                res.send(error.message);
            } else {
                res.send('Erro inesperado');
            }
        }
    };

    // UPDATE
    public updatePost = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;

            const newId = req.body.id as string;
            const newCreatorId = req.body.creatorId as string;
            const newContent = req.body.content as string;
            const newLikes = req.body.likes as number;
            const newDislikes = req.body.dislikes as number;
            const newCreatedAt = req.body.createdAt as string;
            const newUpdatedAt = req.body.updatedAt as string;

            const postDatabase = new PostDatabase();
            const postDBExists = await postDatabase.findPostById(id);

            if (!postDBExists) {
                res.status(400);
                throw new Error("'id' não encontrado");
            }

            const post = new Post(
                postDBExists.id,
                postDBExists.creator_id,
                postDBExists.content,
                postDBExists.likes,
                postDBExists.dislikes,
                postDBExists.created_at,
                postDBExists.updated_at
            );

            if (typeof newId !== 'string') {
                res.status(400);
                throw new Error("'id' deve ser string");
            }

            if (typeof newCreatorId !== 'string') {
                res.status(400);
                throw new Error("'creatorId' deve ser string");
            }

            if (typeof newContent !== 'string') {
                res.status(400);
                throw new Error("'content' deve ser string");
            }

            if (typeof newLikes !== 'number') {
                res.status(400);
                throw new Error("'likes' deve ser number");
            }

            if (typeof newDislikes !== 'number') {
                res.status(400);
                throw new Error("'dislikes' deve ser number");
            }

            if (typeof newCreatedAt !== 'string') {
                res.status(400);
                throw new Error("'createdAt' deve ser string");
            }

            if (typeof newUpdatedAt !== 'string') {
                res.status(400);
                throw new Error("'updatedAt' deve ser string");
            }

            newId && post.setId(newId);
            newCreatorId && post.setCreatedId(newCreatorId);
            newContent && post.setContent(newContent);
            newLikes && post.setLikes(newLikes);
            newDislikes && post.setDislikes(newDislikes);
            newCreatedAt && post.setCreatedAt(newCreatedAt);
            newUpdatedAt && post.setUpdatedAt(newUpdatedAt);

            const newPost: TPost = {
                id: post.getId(),
                creator_id: post.getCreatedId(),
                content: post.getContent(),
                likes: post.getLikes(),
                dislikes: post.getDislikes(),
                created_at: post.getCreatedAt(),
                updated_at: post.getUpdatedAt(),
            };

            await postDatabase.updatePostById(id, newPost);

            res.status(200).send({
                message: 'Post atualizado com sucesso',
                newPost,
            });
        } catch (error) {
            console.log(error);

            if (req.statusCode === 200) {
                res.status(500);
            }

            if (error instanceof Error) {
                res.send(error.message);
            } else {
                res.send('Erro inesperado');
            }
        }
    };

    // DELETE
    public deletePost = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;

            const postDatabase = new PostDatabase();
            const postDBExists = await postDatabase.findPostById(id);

            if (!postDBExists) {
                res.status(400);
                throw new Error("'id' não existe");
            }

            const post = new Post(
                postDBExists.id,
                postDBExists.creator_id,
                postDBExists.content,
                postDBExists.likes,
                postDBExists.dislikes,
                postDBExists.created_at,
                postDBExists.updated_at
            );

            await postDatabase.deletePostById(post.getId());
            res.status(200).send({ message: 'Post deletado com sucesso' });
        } catch (error) {
            console.log(error);

            if (req.statusCode === 200) {
                res.status(500);
            }

            if (error instanceof Error) {
                res.send(error.message);
            } else {
                res.send('Erro inesperado');
            }
        }
    };
}

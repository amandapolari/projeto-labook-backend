import { Request, Response } from 'express';
import { PostBusiness } from '../business/PostBusiness';
import { BaseError } from '../errors/BaseError';
import { CreatePostSchema } from '../dtos/posts/createPostDto';

export class PostController {
    constructor(private postBusiness: PostBusiness) {}
    // GET
    public getPosts = async (req: Request, res: Response) => {
        try {
            const input = {
                q: req.query.q as string | undefined,
            };
            const output = await this.postBusiness.getPosts(input);

            res.status(200).send(output);
        } catch (error) {
            console.log(error);
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send('Erro inesperado');
            }
        }
    };

    // POST
    public createPost = async (req: Request, res: Response) => {
        try {
            const input = CreatePostSchema.parse({
                token: req.headers.authorization as string,
                content: req.body.content as string,
            });

            const output = await this.postBusiness.createPost(input);

            res.status(201).send(output);
        } catch (error) {
            console.log(error);
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send('Erro inesperado');
            }
        }
    };

    // UPDATE
    public updatePost = async (req: Request, res: Response) => {
        try {
            const input = {
                id: req.params.id,
                newId: req.body.id as string,
                newCreatorId: req.body.creatorId as string,
                newContent: req.body.content as string,
                newLikes: req.body.likes as number,
                newDislikes: req.body.dislikes as number,
                newCreatedAt: req.body.createdAt as string,
                newUpdatedAt: req.body.updatedAt as string,
            };

            const output = await this.postBusiness.updatePost(input);

            res.status(200).send(output);
        } catch (error) {
            console.log(error);
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send('Erro inesperado');
            }
        }
    };

    // DELETE
    public deletePost = async (req: Request, res: Response) => {
        try {
            const input = {
                id: req.params.id,
            };

            const output = await this.postBusiness.deletePost(input);

            res.status(200).send(output);
        } catch (error) {
            console.log(error);
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send('Erro inesperado');
            }
        }
    };
}

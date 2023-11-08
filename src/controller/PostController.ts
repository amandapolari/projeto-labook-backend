import { Request, Response } from 'express';
import { PostBusiness } from '../business/PostBusiness';

export class PostController {
    // GET
    public getPosts = async (req: Request, res: Response) => {
        try {
            const input = {
                q: req.query.q as string | undefined,
            };

            const postBusiness = new PostBusiness();
            const output = await postBusiness.getPosts(input);

            res.status(200).send(output);
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
            const input = {
                id: req.body.id as string,
                creatorId: req.body.creatorId as string,
                content: req.body.content as string,
                likes: req.body.likes as number,
                dislikes: req.body.dislikes as number,
            };

            const postBusiness = new PostBusiness();
            const output = await postBusiness.createPost(input);

            res.status(201).send(output);
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

            const postBusiness = new PostBusiness();
            const output = await postBusiness.updatePost(input);

            res.status(200).send(output);
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
            const input = {
                id: req.params.id,
            };

            const postBusiness = new PostBusiness();
            const output = await postBusiness.deletePost(input);

            res.status(200).send(output);
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

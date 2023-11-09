import { format } from 'date-fns';
import { PostDatabase } from '../database/PostDatabase';
import { Post } from '../models/Post';
import { TPost } from '../types';
import { BadRequestError } from '../errors/BadRequestError';

export class PostBusiness {
    // GET
    public getPosts = async (input: any) => {
        const { q } = input;

        const postDataBase = new PostDatabase();
        const postsDB = await postDataBase.findPosts(q as string | undefined);

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

        const output = posts;

        return output;
    };

    // POST
    public createPost = async (input: any) => {
        const { id, creatorId, content, likes, dislikes } = input;

        if (typeof id !== 'string') {
            throw new BadRequestError("'id' deve ser string");
        }

        if (typeof creatorId !== 'string') {
            throw new BadRequestError("'creatorId' deve ser string");
        }

        if (typeof content !== 'string') {
            throw new BadRequestError("'content' deve ser string");
        }

        if (typeof likes !== 'number') {
            throw new BadRequestError("'likes' deve ser number");
        }

        if (typeof dislikes !== 'number') {
            throw new BadRequestError("'dislikes' deve ser number");
        }

        const postDatabase = new PostDatabase();
        const postDBExists = await postDatabase.findPostById(id);

        if (postDBExists) {
            throw new BadRequestError("'id' já existe");
        }

        const post = new Post(
            id,
            creatorId,
            content,
            likes,
            dislikes,
            format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
            format(new Date(), 'dd-MM-yyyy HH:mm:ss')
        );

        const newPost: TPost = {
            id: post.getId(),
            creator_id: post.getCreatedId(),
            content: post.getContent(),
            likes: post.getLikes(),
            dislikes: post.getDislikes(),
            created_at: post.getCreatedAt(),
            updated_at: post.getUpdatedAt(),
        };

        await postDatabase.insertPost(newPost);

        const output = {
            message: 'Post criado com sucesso',
            post: post,
        };

        return output;
    };

    // UPDATE
    public updatePost = async (input: any) => {
        const {
            id,
            newId,
            newCreatorId,
            newContent,
            newLikes,
            newDislikes,
            newCreatedAt,
            newUpdatedAt,
        } = input;

        const postDatabase = new PostDatabase();
        const postDBExists = await postDatabase.findPostById(id);

        if (!postDBExists) {
            throw new BadRequestError("'id' não encontrado");
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

        if (newId !== undefined) {
            if (typeof newId !== 'string') {
                throw new BadRequestError("'id' deve ser string");
            }
        }

        if (newCreatorId !== undefined) {
            if (typeof newCreatorId !== 'string') {
                throw new BadRequestError("'creatorId' deve ser string");
            }
        }

        if (newContent !== undefined) {
            if (typeof newContent !== 'string') {
                throw new BadRequestError("'content' deve ser string");
            }
        }

        if (newLikes !== undefined) {
            if (typeof newLikes !== 'number') {
                throw new BadRequestError("'likes' deve ser number");
            }
        }

        if (newDislikes !== undefined) {
            if (typeof newDislikes !== 'number') {
                throw new BadRequestError("'dislikes' deve ser number");
            }
        }

        if (newCreatedAt !== undefined) {
            if (typeof newCreatedAt !== 'string') {
                throw new BadRequestError("'createdAt' deve ser string");
            }
        }

        if (newUpdatedAt !== undefined) {
            if (typeof newUpdatedAt !== 'string') {
                throw new BadRequestError("'updatedAt' deve ser string");
            }
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

        const output = {
            message: 'Post atualizado com sucesso',
            post: post,
        };

        return output;
    };

    // DELETE
    public deletePost = async (input: any) => {
        const { id } = input;

        const postDatabase = new PostDatabase();
        const postDBExists = await postDatabase.findPostById(id);

        if (!postDBExists) {
            throw new BadRequestError("'id' não existe");
        }

        // PRECISA MESMO INTANCIAR????
        const post = new Post(
            postDBExists.id,
            postDBExists.creator_id,
            postDBExists.content,
            postDBExists.likes,
            postDBExists.dislikes,
            postDBExists.created_at,
            postDBExists.updated_at
        );

        await postDatabase.deletePostById(id);

        const output = {
            message: 'Post deletado com sucesso',
            post: post,
        };

        return output;
    };
}

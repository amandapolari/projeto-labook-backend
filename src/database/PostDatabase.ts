import { LikeDislikeDB, PostDB } from '../models/Post';
import { BaseDatabase } from './BaseDatabase';

export class PostDatabase extends BaseDatabase {
    public static TABLE_POSTS = 'posts';
    public static TABLE_LIKES_DISLIKES = 'likes_dislikes';

    public async findPosts(q: string | undefined) {
        let postsDB;

        if (q) {
            const result: PostDB[] = await BaseDatabase.connection(
                PostDatabase.TABLE_POSTS
            )
                .where('content', 'LIKE', `%${q}%`)
                .orderBy('id', 'ASC');

            postsDB = result;
        } else {
            const result: PostDB[] = await BaseDatabase.connection(
                PostDatabase.TABLE_POSTS
            ).orderBy('id', 'ASC');

            postsDB = result;
        }

        return postsDB;
    }

    public async findAllPosts() {
        const result: PostDB[] = await BaseDatabase.connection(
            PostDatabase.TABLE_POSTS
        ).orderBy('id', 'ASC');

        return result;
    }

    public async findPostById(id: string): Promise<PostDB> {
        const [postDB]: PostDB[] = await BaseDatabase.connection(
            PostDatabase.TABLE_POSTS
        ).where({ id });

        return postDB;
    }

    public async insertPost(newPostDB: PostDB) {
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS).insert(
            newPostDB
        );
    }

    public async updatePostById(
        id: string,
        content: string,
        updated_at: string
    ): Promise<void> {
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
            .where({ id })
            .update({ content, updated_at });
    }

    public async updateDateById(id: string, updated_at: PostDB): Promise<void> {
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
            .where({ id })
            .update(updated_at);
    }

    public async deletePostById(id: string): Promise<void> {
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
            .where({ id })
            .del();
    }

    public findLikeOrDislike = async (
        userId: string,
        postId: string
    ): Promise<LikeDislikeDB | undefined> => {
        const [result]: LikeDislikeDB[] = await BaseDatabase.connection(
            PostDatabase.TABLE_LIKES_DISLIKES
        )
            .select()
            .where({
                user_id: userId,
                post_id: postId,
            });

        return result;
    };

    public createLikeDislike = async (
        userId: string,
        postId: string,
        like: number
    ): Promise<void> => {
        await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES).insert(
            {
                user_id: userId,
                post_id: postId,
                like,
            }
        );
    };

    public updateLikes = async (
        postId: string,
        likes: number
    ): Promise<void> => {
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
            .update({ likes })
            .where({ id: postId });
    };

    public updateDislikes = async (
        postId: string,
        dislikes: number
    ): Promise<void> => {
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
            .update({ dislikes })
            .where({ id: postId });
    };

    public removeLikeDislike = async (
        postId: string,
        userId: string
    ): Promise<void> => {
        await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .delete()
            .where({
                post_id: postId,
                user_id: userId,
            });
    };

    public updateLikeDislike = async (
        postId: string,
        userId: string,
        like: number
    ): Promise<void> => {
        await BaseDatabase.connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .update({
                like,
            })
            .where({
                post_id: postId,
                user_id: userId,
            });
    };
}

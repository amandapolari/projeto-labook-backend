import { TPost } from '../types';
import { BaseDatabase } from './BaseDatabase';

export class PostDatabase extends BaseDatabase {
    public static TABLE_POSTS = 'posts';

    public async findPosts(q: string | undefined) {
        let postsDB;

        if (q) {
            const result: TPost[] = await BaseDatabase.connection(
                PostDatabase.TABLE_POSTS
            ).where('content', 'LIKE', `%${q}%`);

            postsDB = result;
        } else {
            const result: TPost[] = await BaseDatabase.connection(
                PostDatabase.TABLE_POSTS
            );

            postsDB = result;
        }

        return postsDB;
    }

    public async findPostById(id: string): Promise<TPost> {
        const [postDB]: TPost[] = await BaseDatabase.connection(
            PostDatabase.TABLE_POSTS
        ).where({ id });

        return postDB;
    }

    public async insertPost(newPostDB: TPost) {
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS).insert(
            newPostDB
        );
    }

    public async updatePostById(id: string, content: TPost): Promise<void> {
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
            .where({ id })
            .update(content);
    }

    public async deletePostById(id: string): Promise<void> {
        await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
            .where({ id })
            .del();
    }
}

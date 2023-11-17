import { PostDB } from '../models/Post';
import { BaseDatabase } from './BaseDatabase';

export class PostDatabase extends BaseDatabase {
    public static TABLE_POSTS = 'posts';

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

    public async updatePostById(id: string, content: PostDB): Promise<void> {
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

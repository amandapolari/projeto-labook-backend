// TIPAR MELHOR ESSE ARQUIVO
import { TUser } from '../types';
import { BaseDatabase } from './BaseDatabase';

export class UserDatabase extends BaseDatabase {
    public static TABLE_USERS = 'users';

    public async findUsers(q: string | undefined) {
        let usersDB;

        if (q) {
            const result: TUser[] = await BaseDatabase.connection(
                UserDatabase.TABLE_USERS
            )
                .where('name', 'LIKE', `%${q}%`)
                .orderBy('id', 'ASC');

            usersDB = result;
        } else {
            const result: TUser[] = await BaseDatabase.connection(
                UserDatabase.TABLE_USERS
            ).orderBy('id', 'ASC');

            usersDB = result;
        }

        return usersDB;
    }

    public async findUserById(id: string): Promise<TUser> {
        const [userDB]: TUser[] = await BaseDatabase.connection(
            UserDatabase.TABLE_USERS
        ).where({ id });

        return userDB;
    }

    public async findUserByEmail(email: string) {
        const [userDB] = await BaseDatabase.connection(
            UserDatabase.TABLE_USERS
        ).where({ email });

        return userDB;
    }

    public async insertUser(newUserDB: TUser): Promise<void> {
        await BaseDatabase.connection(UserDatabase.TABLE_USERS).insert(
            newUserDB
        );
    }

    public async updateUserById(id: string, content: TUser): Promise<void> {
        await BaseDatabase.connection(UserDatabase.TABLE_USERS)
            .where({ id })
            .update(content);
    }

    public async deleteUserById(id: string): Promise<void> {
        await BaseDatabase.connection(UserDatabase.TABLE_USERS)
            .where({ id })
            .del();
    }
}

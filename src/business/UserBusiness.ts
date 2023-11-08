import { format } from 'date-fns';
import { UserDatabase } from '../database/UserDatabase';
import { User } from '../models/User';
import { TUser } from '../types';

export class UserBusiness {
    // GET
    public getUsers = async (input: any) => {
        const { q } = input;

        const userDatabase = new UserDatabase();
        const usersDB = await userDatabase.findUsers(q as string | undefined);

        const users: User[] = usersDB.map((user: TUser) => {
            return new User(
                user.id,
                user.name,
                user.email,
                user.password,
                user.role,
                user.created_at
            );
        });

        const output = users;

        return output;
    };

    // POST
    public createUser = async (input: any) => {
        const { id, name, email, password, role } = input;

        if (typeof id !== 'string') {
            // res.status(400);
            throw new Error("'id' deve ser string");
        }

        if (typeof name !== 'string') {
            // res.status(400);
            throw new Error("'name' deve ser string");
        }

        if (typeof email !== 'string') {
            // res.status(400);
            throw new Error("'email' deve ser string");
        }

        if (typeof password !== 'string') {
            // res.status(400);
            throw new Error("'password' deve ser string");
        }

        if (typeof role !== 'string') {
            // res.status(400);
            throw new Error("'role' deve ser string");
        }

        const userDatabase = new UserDatabase();
        const userDBExists = await userDatabase.findUserById(id);

        if (userDBExists) {
            // res.status(400);
            throw new Error("'id' já existe");
        }

        const user = new User(
            id,
            name,
            email,
            password,
            role,
            format(new Date(), 'dd-MM-yyyy HH:mm:ss')
        );

        const newUser: TUser = {
            id: user.getId(),
            name: user.getName(),
            email: user.getEmail(),
            password: user.getPassword(),
            role: user.getRole(),
            created_at: user.getUpdatedAt(),
        };

        await userDatabase.insertUser(newUser);

        const output = {
            message: 'Usuário criado com sucesso',
            user: user,
        };

        return output;
    };

    // UPDATE
    public updateUser = async (input: any) => {
        const {
            id,
            newId,
            newName,
            newEmail,
            newPassword,
            newRole,
            newCreatedAt,
        } = input;

        const userDatabase = new UserDatabase();
        const userDBExists = await userDatabase.findUserById(id);

        if (!userDBExists) {
            // res.status(400);
            throw new Error("'id' não encontrado");
        }

        const user = new User(
            userDBExists.id,
            userDBExists.name,
            userDBExists.email,
            userDBExists.password,
            userDBExists.role,
            userDBExists.created_at
        );

        if (newId !== undefined) {
            if (typeof newId !== 'string') {
                // res.status(400);
                throw new Error("'newId' deve ser string");
            }
        }

        if (newName !== undefined) {
            if (typeof newName !== 'string') {
                // res.status(400);
                throw new Error("'newName' deve ser string");
            }
        }

        if (newEmail !== undefined) {
            if (typeof newEmail !== 'string') {
                // res.status(400);
                throw new Error("'newEmail' deve ser string");
            }
        }

        if (newPassword !== undefined) {
            if (typeof newPassword !== 'string') {
                // res.status(400);
                throw new Error("'newPassword' deve ser string");
            }
        }

        if (newRole !== undefined) {
            if (typeof newRole !== 'string') {
                // res.status(400);
                throw new Error("'newRole' deve ser string");
            }
        }

        if (newCreatedAt !== undefined) {
            if (typeof newCreatedAt !== 'string') {
                // res.status(400);
                throw new Error("'newCreatedAt' deve ser string");
            }
        }

        newId && user.setId(newId);
        newName && user.setName(newName);
        newEmail && user.setEmail(newEmail);
        newPassword && user.setPassword(newPassword);
        newRole && user.setRole(newRole);
        newCreatedAt && user.setUpdatedAt(newCreatedAt);

        const newUser: TUser = {
            id: user.getId(),
            name: user.getName(),
            email: user.getEmail(),
            password: user.getPassword(),
            role: user.getRole(),
            created_at: user.getUpdatedAt(),
        };

        await userDatabase.updateUserById(id, newUser);

        const output = {
            message: 'Usuário atualizado com sucesso',
            user: user,
        };

        return output;
    };

    // DELETE
    public deleteUser = async (input: any) => {
        const { id } = input;

        const userDatabase = new UserDatabase();
        const userDBExists = await userDatabase.findUserById(id);

        if (!userDBExists) {
            // res.status(400);
            throw new Error("'id' não existe");
        }

        const user = new User(
            userDBExists.id,
            userDBExists.name,
            userDBExists.email,
            userDBExists.password,
            userDBExists.role,
            userDBExists.created_at
        );

        await userDatabase.deleteUserById(user.getId());

        const output = {
            message: 'Usuário deletado com sucesso',
        };

        return output;
    };
}

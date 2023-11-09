import { format } from 'date-fns';
import { UserDatabase } from '../database/UserDatabase';
import { User } from '../models/User';
import { TUser } from '../types';
import { BadRequestError } from '../errors/BadRequestError';

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
            throw new BadRequestError("'id' deve ser string");
        }

        if (typeof name !== 'string') {
            throw new BadRequestError("'name' deve ser string");
        }

        if (typeof email !== 'string') {
            throw new BadRequestError("'email' deve ser string");
        }

        if (typeof password !== 'string') {
            throw new BadRequestError("'password' deve ser string");
        }

        if (typeof role !== 'string') {
            throw new BadRequestError("'role' deve ser string");
        }

        const userDatabase = new UserDatabase();
        const userDBExists = await userDatabase.findUserById(id);

        if (userDBExists) {
            throw new BadRequestError("'id' já existe");
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
            throw new BadRequestError("'id' não encontrado");
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
                throw new BadRequestError("'newId' deve ser string");
            }
        }

        if (newName !== undefined) {
            if (typeof newName !== 'string') {
                throw new BadRequestError("'newName' deve ser string");
            }
        }

        if (newEmail !== undefined) {
            if (typeof newEmail !== 'string') {
                throw new BadRequestError("'newEmail' deve ser string");
            }
        }

        if (newPassword !== undefined) {
            if (typeof newPassword !== 'string') {
                throw new BadRequestError("'newPassword' deve ser string");
            }
        }

        if (newRole !== undefined) {
            if (typeof newRole !== 'string') {
                throw new BadRequestError("'newRole' deve ser string");
            }
        }

        if (newCreatedAt !== undefined) {
            if (typeof newCreatedAt !== 'string') {
                // res.status(400);
                throw new BadRequestError("'newCreatedAt' deve ser string");
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
            throw new BadRequestError("'id' não existe");
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

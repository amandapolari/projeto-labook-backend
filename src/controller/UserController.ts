import { format } from 'date-fns';
import { Request, Response } from 'express';
import { UserDatabase } from '../database/UserDatabase';
import { User } from '../models/User';
import { TUser } from '../types';

export class UserController {
    // GET
    public getUsers = async (req: Request, res: Response) => {
        try {
            const q = req.query.q;
            const userDatabase = new UserDatabase();
            const usersDB = await userDatabase.findUsers(
                q as string | undefined
            );
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
            res.status(200).send(users);
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
    public createUser = async (req: Request, res: Response) => {
        try {
            const { id, name, email, password, role, createdAt } = req.body;

            if (typeof id !== 'string') {
                res.status(400);
                throw new Error("'id' deve ser string");
            }

            if (typeof name !== 'string') {
                res.status(400);
                throw new Error("'name' deve ser string");
            }

            if (typeof email !== 'string') {
                res.status(400);
                throw new Error("'email' deve ser string");
            }

            if (typeof password !== 'string') {
                res.status(400);
                throw new Error("'password' deve ser string");
            }

            if (typeof role !== 'string') {
                res.status(400);
                throw new Error("'role' deve ser string");
            }

            if (typeof createdAt !== 'string') {
                res.status(400);
                throw new Error("'createdAt' deve ser string");
            }

            const userDatabase = new UserDatabase();
            const userDBExists = await userDatabase.findUserById(id);
            const currentDate = new Date();

            if (userDBExists) {
                res.status(400);
                throw new Error("'id' já existe");
            }

            const video = new User(
                id,
                name,
                email,
                password,
                role,
                format(currentDate, 'dd-MM-yyyy HH:mm:ss')
            );

            const newUser: TUser = {
                id: video.getId(),
                name: video.getName(),
                email: video.getEmail(),
                password: video.getPassword(),
                role: video.getRole(),
                created_at: video.getUpdatedAt(),
            };

            await userDatabase.insertUser(newUser);

            res.status(201).send({
                message: 'Usuário criado com sucesso',
                newUser,
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
    public updateUser = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;

            const newId = req.body.id as string;
            const newName = req.body.name as string;
            const newEmail = req.body.email as string;
            const newPassword = req.body.password as string;
            const newRole = req.body.role as string;
            const newCreatedAt = req.body.createdAt as string;

            const userDatabase = new UserDatabase();
            const userDBExists = await userDatabase.findUserById(id);

            if (!userDBExists) {
                res.status(400);
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

            // if (typeof newId !== 'string') {
            //     res.status(400);
            //     throw new Error("'id' deve ser string");
            // }

            if (typeof newName !== 'string') {
                res.status(400);
                throw new Error("'name' deve ser string");
            }

            if (typeof newEmail !== 'string') {
                res.status(400);
                throw new Error("'email' deve ser string");
            }

            if (typeof newPassword !== 'string') {
                res.status(400);
                throw new Error("'password' deve ser string");
            }

            if (typeof newRole !== 'string') {
                res.status(400);
                throw new Error("'role' deve ser string");
            }

            if (typeof newCreatedAt !== 'string') {
                res.status(400);
                throw new Error("'createdAt' deve ser string");
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

            console.log(newUser);

            await userDatabase.updateUserById(id, newUser);

            res.status(200).send({
                message: 'User atualizado com sucesso',
                newUser,
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
    public deleteUser = async (req: Request, res: Response) => {
        try {
            const id = req.params.id;

            const userDatabase = new UserDatabase();
            const userDBExists = await userDatabase.findUserById(id);

            if (!userDBExists) {
                res.status(400);
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
            res.status(200).send({ message: 'User deletado com sucesso' });
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

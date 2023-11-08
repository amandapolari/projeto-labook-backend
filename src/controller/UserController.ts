import { Request, Response } from 'express';
import { UserBusiness } from '../business/UserBusiness';

export class UserController {
    // GET
    public getUsers = async (req: Request, res: Response) => {
        try {
            const input = {
                q: req.query.q as string | undefined,
            };

            const userBusiness = new UserBusiness();
            const output = await userBusiness.getUsers(input);

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
    public createUser = async (req: Request, res: Response) => {
        try {
            const input = {
                id: req.body.id as string,
                name: req.body.name as string,
                email: req.body.email as string,
                password: req.body.password as string,
                role: req.body.role as string,
            };

            const userBusiness = new UserBusiness();
            const output = await userBusiness.createUser(input);

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
    public updateUser = async (req: Request, res: Response) => {
        try {
            const input = {
                id: req.params.id,
                newId: req.body.id as string,
                newName: req.body.name as string,
                newEmail: req.body.email as string,
                newPassword: req.body.password as string,
                newRole: req.body.role as string,
                newCreatedAt: req.body.createdAt as string,
            };

            const userBusiness = new UserBusiness();
            const output = await userBusiness.updateUser(input);

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
    public deleteUser = async (req: Request, res: Response) => {
        try {
            const input = {
                id: req.params.id,
            };

            const userBusiness = new UserBusiness();
            const output = await userBusiness.deleteUser(input);

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

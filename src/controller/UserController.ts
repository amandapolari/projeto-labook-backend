import { Request, Response } from 'express';
import { UserBusiness } from '../business/UserBusiness';
import { BaseError } from '../errors/BaseError';
import { SignupSchema } from '../dtos/users/signupDto';
import { ZodError } from 'zod';
import { LoginSchema } from '../dtos/users/loginDto';
import { GetUsersSchema } from '../dtos/users/getUsersDto';

export class UserController {
    constructor(private userBusiness: UserBusiness) {}

    // GET => Endpoint para teste protegido para somente administradores poderem utilizar:
    public getUsers = async (req: Request, res: Response) => {
        try {
            const input = GetUsersSchema.parse({
                q: req.query.q as string | undefined,
                token: req.headers.authorization as string,
            });

            const output = await this.userBusiness.getUsers(input);

            res.status(200).send(output);
        } catch (error) {
            console.log(error);
            if (error instanceof ZodError) {
                res.status(400).send(error.issues);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send('Erro inesperado');
            }
        }
    };

    // SIGNUP
    public signup = async (req: Request, res: Response) => {
        try {
            const input = SignupSchema.parse({
                name: req.body.name as string,
                email: req.body.email as string,
                password: req.body.password as string,
            });

            const output = await this.userBusiness.signup(input);

            res.status(201).send(output);
        } catch (error) {
            console.log(error);
            if (error instanceof ZodError) {
                res.status(400).send(error.issues);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send('Erro inesperado');
            }
        }
    };

    // LOGIN
    public login = async (req: Request, res: Response) => {
        try {
            const input = LoginSchema.parse({
                email: req.body.email,
                password: req.body.password,
            });

            const output = await this.userBusiness.login(input);

            res.status(200).send(output);
        } catch (error) {
            console.log(error);
            if (error instanceof ZodError) {
                res.status(400).send(error.issues);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send('Erro inesperado');
            }
        }
    };
}

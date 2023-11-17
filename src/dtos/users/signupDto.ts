// (OBRIGATÓRIO)

import z from 'zod';

export interface SignupInputDTO {
    name: string;
    email: string;
    password: string;
}

export interface SignupOutputDTO {
    message: string;
    token: string;
}

export const SignupSchema = z
    .object({
        name: z
            .string({
                required_error: "'name' é obrigatório",
                invalid_type_error: "'name' deve ser do tipo string",
            })
            .min(2, "'name' deve possuir no mínimo 2 caracteres"),
        email: z
            .string({
                required_error: "'email' é obrigatório",
                invalid_type_error: "'email' deve ser do tipo string",
            })
            .email("'email' inválido"),
        password: z
            .string({
                required_error: "'password' é obrigatório",
                invalid_type_error: "'password' deve ser do tipo string",
            })
            .min(4, "'password' deve possuir no mínimo 4 caracteres"),
    })
    .transform((data) => data as SignupInputDTO);

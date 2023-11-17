import z from 'zod';

export interface LoginInputDTO {
    email: string;
    password: string;
}

export interface LoginOutputDTO {
    message: string;
    token: string;
}

export const LoginSchema = z
    .object({
        email: z
            .string({
                required_error: "'email' é obrigatório",
                invalid_type_error: "'email' deve ser do tipo string",
            })
            .email(),
        password: z
            .string({
                required_error: "'senha' é obrigatória",
                invalid_type_error: "'senha' deve ser do tipo string",
            })
            .min(4),
    })
    .transform((data) => data as LoginInputDTO);

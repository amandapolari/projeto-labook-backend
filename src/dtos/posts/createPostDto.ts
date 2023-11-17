// (OBRIGATÓRIO)

import z from 'zod';

export interface CreateInputDTO {
    token: string;
    content: string;
}

export interface CreateOutputDTO {
    message: string;
    content: string;
}

export const CreatePostSchema = z
    .object({
        token: z
            .string({
                required_error: "'token' é obrigatório",
                invalid_type_error: "'token' deve ser do tipo string",
            })
            .min(4, "'token' deve possuir no mínimo 4 caracteres"),
        content: z
            .string({
                required_error: "'content' é obrigatório",
                invalid_type_error: "'content' deve ser do tipo string",
            })
            .min(1, "'content' deve possuir no mínimo 1 caracteres"),
    })
    .transform((data) => data as CreateInputDTO);

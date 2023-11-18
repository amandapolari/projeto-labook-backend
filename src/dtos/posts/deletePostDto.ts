import z from 'zod';

export interface DeletePostInputDTO {
    id: string;
    token: string;
}

export interface DeletePostOutputDTO {
    message: string;
}

export const DeletePostSchema = z
    .object({
        id: z
            .string({
                required_error: "'id' é obrigatória",
                invalid_type_error: "'id' deve ser do tipo string",
            })
            .min(1, "'id' deve possuir no mínimo 1 caractere"),
        token: z
            .string({
                required_error: "'token' é obrigatória",
                invalid_type_error: "'token' deve ser do tipo string",
            })
            .min(1, "'token' deve possuir no mínimo 1 caractere"),
    })
    .transform((data) => data as DeletePostInputDTO);

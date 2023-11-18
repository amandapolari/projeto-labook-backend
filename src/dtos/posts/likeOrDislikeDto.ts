import z from 'zod';

export interface LikeOrDislikeInputDTO {
    idPost: string;
    token: string;
    like: boolean;
}

export type LikeOrDislikeOutputDTO = undefined;

export const LikeOrDislikeSchema = z
    .object({
        idPost: z
            .string({
                required_error: "'idPost' é obrigatória",
                invalid_type_error: "'idPost' deve ser do tipo string",
            })
            .min(1, "'idPost' deve possuir no mínimo 1 caractere"),
        token: z
            .string({
                required_error: "'token' é obrigatória",
                invalid_type_error: "'token' deve ser do tipo string",
            })
            .min(1, "'token' deve possuir no mínimo 1 caractere"),
        like: z.boolean(),
    })
    .transform((data) => data as LikeOrDislikeInputDTO);

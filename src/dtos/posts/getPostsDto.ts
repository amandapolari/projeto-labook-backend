import z from 'zod';
import { PostModel } from '../../models/Post';

export interface GetPostsInputDTO {
    q: string | undefined;
    token: string;
}

export type GetPostsOutputDTO = PostModel[];

export const GetPostsSchema = z
    .object({
        q: z
            .string({
                invalid_type_error: "'q' deve ser do tipo string",
            })
            .optional(),
        token: z
            .string({
                required_error: "'token' é obrigatório",
                invalid_type_error: "'token' deve ser do tipo string",
            })
            .min(4, "'token' deve possuir no mínimo 4 caracteres"),
    })
    .transform((data) => data as GetPostsInputDTO);

import z from 'zod';
import { UserModel } from '../../models/User';

export interface GetUsersInputDTO {
    q: string | undefined;
    token: string;
}

export type GetUsersOutputDTO = UserModel[];

export const GetUsersSchema = z
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
            .min(1),
    })
    .transform((data) => data as GetUsersInputDTO);

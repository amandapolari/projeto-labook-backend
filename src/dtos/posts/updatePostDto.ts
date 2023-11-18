import z from 'zod';

export interface UpdatePostInputDTO {
    idToEdit: string;
    token: string;
    newContent: string;
}

export type UpdatePostOutputDTO = {
    message: string;
    content: {};
};

export const UpdatePostSchema = z
    .object({
        idToEdit: z.string({
            required_error: '"idToEdit" é obrigtório',
            invalid_type_error: '"idToEdit" deve ser uma string',
        }),
        token: z.string({
            required_error: '"token" é obrigatório',
            invalid_type_error: '"token" precisa ser uma string',
        }),
        newContent: z.string({
            invalid_type_error: '"content" precisa ser uma string',
        }),
    })
    .transform((data) => data as UpdatePostInputDTO);

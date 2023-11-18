import { format } from 'date-fns';
import { PostDatabase } from '../database/PostDatabase';
import { GetPost, Post, PostDB } from '../models/Post';
import { BadRequestError } from '../errors/BadRequestError';
import { IdGenerator } from '../services/IdGenerator';
import { TokenManager } from '../services/TokenManager';
import { UserDatabase } from '../database/UserDatabase';
import { GetPostsInputDTO } from '../dtos/posts/getPostsDto';
import { CreateInputDTO } from '../dtos/posts/createPostDto';
import {
    UpdatePostInputDTO,
    UpdatePostOutputDTO,
} from '../dtos/posts/updatePostDto';
import {
    DeletePostInputDTO,
    DeletePostOutputDTO,
} from '../dtos/posts/deletePostDto';
import {
    LikeOrDislikeInputDTO,
    LikeOrDislikeOutputDTO,
} from '../dtos/posts/likeOrDislikeDto';
import { NotFoundError } from '../errors/NotFoundError';

export class PostBusiness {
    constructor(
        private postDatabase: PostDatabase,
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) {}

    // GET
    public getPosts = async (input: GetPostsInputDTO) => {
        const { q, token } = input;

        const postsDB = await this.postDatabase.findPosts(
            q as string | undefined
        );

        const payload = this.tokenManager.getPayload(token);

        if (payload === null) {
            throw new BadRequestError('token inválido');
        }

        const posts: Post[] = postsDB.map((post: PostDB) => {
            return new Post(
                post.id,
                post.creator_id,
                post.content,
                post.likes,
                post.dislikes,
                post.created_at,
                post.updated_at
            );
        });

        const usersDB = await this.userDatabase.findUsers(
            q as string | undefined
        );

        const mapUserIdName = new Map();

        usersDB.forEach((user: any) => {
            mapUserIdName.set(user.id, user);
        });

        // console.log(mapUserIdName);

        const output: GetPost[] = posts.map((post: Post) => {
            const user = mapUserIdName.get(post.getCreatedId());
            return {
                id: post.getId(),
                content: post.getContent(),
                likes: post.getLikes(),
                dislikes: post.getDislikes(),
                createdAt: post.getCreatedAt(),
                updatedAt: post.getUpdatedAt(),
                creator: {
                    id: user.id,
                    name: user.name,
                },
            };
        });

        return output;
    };

    // POST
    public createPost = async (input: CreateInputDTO) => {
        // Recebendo dados do input:
        const { token, content } = input;

        // Gerando uuid:
        const id = this.idGenerator.generate();

        // Vericando se o id já existe:
        const postDBExists = await this.postDatabase.findPostById(id);

        if (postDBExists) {
            throw new BadRequestError("'id' já existe");
        }

        // Gerando uuid para post:
        const payload = this.tokenManager.getPayload(token);

        // testando o que vem no token:
        /*
        {
        id: '073a07d0-56b5-4cc1-9b01-09db47f7f301',
        name: 'Amanda',
        role: 'ADMIN',
        iat: 1700242436,
        exp: 1700847236
        }
        */
        // console.log(payload);
        //--

        // Para garantir que o token é válido:
        if (payload === null) {
            throw new BadRequestError('token inválido');
        }

        // Capturando o id do usuário que criou o post:
        const idCreator = payload.id as string;

        // Intanciando um novo post:
        const post = new Post(
            id,
            idCreator,
            content,
            0,
            0,
            format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
            format(new Date(), 'dd-MM-yyyy HH:mm:ss')
        );

        const newPost: PostDB = {
            id: post.getId(),
            creator_id: post.getCreatedId(),
            content: post.getContent(),
            likes: post.getLikes(),
            dislikes: post.getDislikes(),
            created_at: post.getCreatedAt(),
            updated_at: post.getUpdatedAt(),
        };

        await this.postDatabase.insertPost(newPost);

        const output = {
            message: 'Post criado com sucesso',
            post: content,
        };

        return output;
    };

    // UPDATE
    public updatePost = async (
        input: UpdatePostInputDTO
    ): Promise<UpdatePostOutputDTO> => {
        const { idToEdit, token, newContent } = input;

        const payload = this.tokenManager.getPayload(token);

        if (payload === null) {
            throw new BadRequestError(
                'É preciso um token válido para acessar essa funcionalidade'
            );
        }

        const postDB: PostDB[] = await this.postDatabase.findAllPosts();

        const mapPost = new Map();

        postDB.forEach((post) => {
            mapPost.set(post.id, post);
        });

        const postToEdit = mapPost.get(idToEdit);

        if (postToEdit.creator_id !== payload.id) {
            throw new BadRequestError(
                'Você não tem permissão para editar este post'
            );
        }

        const postDBExists = await this.postDatabase.findPostById(idToEdit);

        if (!postDBExists) {
            throw new BadRequestError(
                'Não foi encontrado nenhum post com id recebido'
            );
        }

        const post = new Post(
            postDBExists.id,
            postDBExists.creator_id,
            postDBExists.content,
            postDBExists.likes,
            postDBExists.dislikes,
            postDBExists.created_at,
            postDBExists.updated_at
        );

        const newDate = format(new Date(), 'dd-MM-yyyy HH:mm:ss');

        newContent && post.setContent(newContent);
        post.setUpdatedAt(newDate);

        const newPost: PostDB = {
            id: post.getId(),
            creator_id: post.getCreatedId(),
            content: post.getContent(),
            likes: post.getLikes(),
            dislikes: post.getDislikes(),
            created_at: post.getCreatedAt(),
            updated_at: post.getUpdatedAt(),
        };

        await this.postDatabase.updatePostById(
            idToEdit,
            newPost.content,
            newPost.updated_at
        );

        // console.log(idToEdit, newPost.content, newPost.updated_at);

        const output: UpdatePostOutputDTO = {
            message: 'Post atualizado com sucesso',
            content: newPost.content,
        };

        return output;
    };

    // DELETE
    public deletePost = async (
        input: DeletePostInputDTO
    ): Promise<DeletePostOutputDTO> => {
        const { id, token } = input;

        // console.log(id, token);

        const payload = this.tokenManager.getPayload(token);

        if (payload === null) {
            throw new BadRequestError(
                'É preciso um token válido para acessar essa funcionalidade'
            );
        }

        const postDB: PostDB[] = await this.postDatabase.findAllPosts();

        const mapPost = new Map();

        postDB.forEach((post) => {
            mapPost.set(post.id, post);
        });

        const postToDelete = mapPost.get(id);

        if (payload.role !== 'ADMIN') {
            if (postToDelete.creator_id !== payload.id) {
                throw new BadRequestError(
                    'Você não tem permissão para deletar este post'
                );
            }
        }

        const postDBExists = await this.postDatabase.findPostById(id);

        if (!postDBExists) {
            throw new BadRequestError("'id' não existe");
        }

        const post = new Post(
            postDBExists.id,
            postDBExists.creator_id,
            postDBExists.content,
            postDBExists.likes,
            postDBExists.dislikes,
            postDBExists.created_at,
            postDBExists.updated_at
        );

        await this.postDatabase.deletePostById(id);

        const output: DeletePostOutputDTO = {
            message: 'Post deletado com sucesso',
        };

        return output;
    };

    // LIKE E DISLAKE
    public likeOrDislike = async (
        input: LikeOrDislikeInputDTO
    ): Promise<LikeOrDislikeOutputDTO> => {
        const { idPost, token, like } = input;

        const payload = this.tokenManager.getPayload(token);

        if (payload === null) {
            throw new BadRequestError(
                'É preciso um token válido para acessar essa funcionalidade'
            );
        }

        const userId = payload.id;

        const postDB = await this.postDatabase.findPostById(idPost);

        if (!postDB) {
            throw new NotFoundError('Não existe post com o id fornecido');
        }

        const post = new Post(
            postDB.id,
            postDB.creator_id,
            postDB.content,
            postDB.likes,
            postDB.dislikes,
            postDB.created_at,
            postDB.updated_at
        );

        if (postDB.creator_id === payload.id) {
            throw new BadRequestError(
                'Não é possível dar like ou dislike no seu próprio post'
            );
        }

        const likeDislikeDB = await this.postDatabase.findLikeOrDislike(
            userId,
            post.getId()
        );

        const likeSqlite = like ? 1 : 0;

        if (!likeDislikeDB) {
            await this.postDatabase.createLikeDislike(
                userId,
                post.getId(),
                likeSqlite
            );

            if (like) {
                post.addLike();
                await this.postDatabase.updateLikes(idPost, post.getLikes());
            } else {
                post.addDislike();

                await this.postDatabase.updateDislikes(
                    idPost,
                    post.getDislikes()
                );
            }
        } else if (likeDislikeDB.like) {
            if (like) {
                await this.postDatabase.removeLikeDislike(idPost, userId);
                post.removeLike();

                await this.postDatabase.updateLikes(idPost, post.getLikes());
            } else {
                await this.postDatabase.updateLikeDislike(
                    idPost,
                    userId,
                    likeSqlite
                );
                post.removeLike();
                post.addDislike();

                await this.postDatabase.updateLikes(idPost, post.getLikes());
                await this.postDatabase.updateDislikes(
                    idPost,
                    post.getDislikes()
                );
            }
        } else {
            if (!like) {
                await this.postDatabase.removeLikeDislike(idPost, userId);
                post.removeDislike();

                await this.postDatabase.updateDislikes(
                    idPost,
                    post.getDislikes()
                );
            } else {
                await this.postDatabase.updateLikeDislike(
                    idPost,
                    userId,
                    likeSqlite
                );
                post.removeDislike();
                post.addLike();

                await this.postDatabase.updateLikes(idPost, post.getLikes());
                await this.postDatabase.updateDislikes(
                    idPost,
                    post.getDislikes()
                );
            }
        }

        return;
    };
}

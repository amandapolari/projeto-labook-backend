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
            throw new BadRequestError(
                'É necessário um token para acessar essa funcionalidade'
            );
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
        const { token, content } = input;

        const id = this.idGenerator.generate();

        const postDBExists = await this.postDatabase.findPostById(id);

        if (postDBExists) {
            throw new BadRequestError("'id' já existe");
        }

        const payload = this.tokenManager.getPayload(token);

        if (payload === null) {
            throw new BadRequestError('token inválido');
        }

        const idCreator = payload.id as string;

        const post = new Post(
            id,
            idCreator,
            content,
            0,
            0,
            format(new Date(), 'dd-MM-yyyy HH:mm:ss'),
            format(new Date(), 'dd-MM-yyyy HH:mm:ss')
        );

        const newPost = post.toPostDB();

        await this.postDatabase.insertPost(newPost);

        const output = {
            message: 'Post criado com sucesso',
            content,
        };

        return output;
    };

    // UPDATE
    public updatePost = async (
        input: UpdatePostInputDTO
    ): Promise<UpdatePostOutputDTO> => {
        const { idToEdit, token, content } = input;

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

        content && post.setContent(content);
        post.setUpdatedAt(newDate);

        const newPost = post.toPostDB();

        await this.postDatabase.updatePostById(
            idToEdit,
            newPost.content,
            newPost.updated_at
        );

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

    // LIKE E DISLIKE
    public likeOrDislike = async (
        input: LikeOrDislikeInputDTO
    ): Promise<LikeOrDislikeOutputDTO> => {
        // Recebendo e desestruturando os dados do input:
        const { idPost, token, like } = input;

        // Obtendo o payload através do token:
        const payload = this.tokenManager.getPayload(token);

        // Se o token for inválido vai retornar null
        if (payload === null) {
            throw new BadRequestError(
                'É preciso um token válido para acessar essa funcionalidade'
            );
        }

        // Esse é o id de quem está logado, pois foi obtido através do token:
        const userId = payload.id;

        // Buscando o post no banco de dados:
        const postDB = await this.postDatabase.findPostById(idPost);

        // Se ele não encontrar o post, vai retornar undefined e vai lançar um erro:
        if (!postDB) {
            throw new NotFoundError('Não existe post com o id fornecido');
        }

        // Instanciando que o usuário foneceu o id:
        const post = new Post(
            postDB.id,
            postDB.creator_id,
            postDB.content,
            postDB.likes,
            postDB.dislikes,
            postDB.created_at,
            postDB.updated_at
        );

        // Se o id do usuário for igual ao id do criador do post, vai lançar um erro:
        if (postDB.creator_id === payload.id) {
            throw new BadRequestError(
                'Não é possível dar like ou dislike no seu próprio post'
            );
        }

        // Buscando no banco de dados se o usuário já deu like ou dislike no post:
        const likeDislikeDB = await this.postDatabase.findLikeOrDislike(
            userId,
            post.getId()
        );

        // Se o usuário tiver dado like ou dislike, vai retornar 1 ou 0:
        // Porque na tabela sql like e dislike são booleanos:
        const likeSqlite = like ? 1 : 0;

        // Se o usuário não tiver dado like ou dislike, vai criar um novo like ou dislike:
        if (!likeDislikeDB) {
            // Inserindo um like ou um dislike no banco de dados na tabela likes_dislikes:
            await this.postDatabase.createLikeDislike(
                userId,
                post.getId(),
                likeSqlite
            );

            // Se o usuário tiver dado like, vai adicionar um like no post:
            if (like) {
                post.addLike();
                await this.postDatabase.updateLikes(idPost, post.getLikes());

                // Se o usuário tiver dado dislike, vai adicionar um dislike no post:
            } else {
                post.addDislike();

                // Atualizando o número de likes e dislikes no banco de dados:
                await this.postDatabase.updateDislikes(
                    idPost,
                    post.getDislikes()
                );
            }

            // Se o usuário já tiver dado like ou dislike, vai atualizar o like ou dislike:
        } else if (likeDislikeDB.like) {
            if (like) {
                // Se o usuário já tiver dado like e clicar em like novamente, vai remover o like:
                await this.postDatabase.removeLikeDislike(idPost, userId);
                post.removeLike();

                // Atualizando o número de likes no banco de dados:
                await this.postDatabase.updateLikes(idPost, post.getLikes());
            } else {
                // Se o usuário já tiver dado like e clicar em dislike, vai atualizar o like para dislike:
                await this.postDatabase.updateLikeDislike(
                    idPost,
                    userId,
                    likeSqlite
                );
                post.removeLike();
                post.addDislike();

                // Atualizando o número de likes e dislikes no banco de dados:
                await this.postDatabase.updateLikes(idPost, post.getLikes());
                await this.postDatabase.updateDislikes(
                    idPost,
                    post.getDislikes()
                );
            }
        } else {
            if (!like) {
                // Se o usuário já tiver dado dislike e clicar em dislike novamente, vai remover o dislike:
                await this.postDatabase.removeLikeDislike(idPost, userId);
                post.removeDislike();

                // Atualizando o número de dislikes no banco de dados:
                await this.postDatabase.updateDislikes(
                    idPost,
                    post.getDislikes()
                );
            } else {
                // Se o usuário já tiver dado dislike e clicar em like, vai atualizar o dislike para like:
                await this.postDatabase.updateLikeDislike(
                    idPost,
                    userId,
                    likeSqlite
                );
                post.removeDislike();
                post.addLike();

                // Atualizando o número de likes e dislikes no banco de dados:
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

import { format } from 'date-fns';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { TPost, TUser } from './types';
import { UserDatabase } from './database/UserDatabase';
import { User } from './models/User';
import { PostDatabase } from './database/PostDatabase';
import { Post } from './models/Post';

const app = express();
app.use(cors());
app.use(express.json());
app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`);
});

// --> PING <--

app.get('/ping', async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: 'Pong!' });
    } catch (error) {
        console.log(error);

        if (req.statusCode === 200) {
            res.status(500);
        }

        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send('Erro inesperado');
        }
    }
});

// --> USERS <--

// GET:
app.get('/users', async (req: Request, res: Response) => {
    try {
        const q = req.query.q;
        const userDatabase = new UserDatabase();
        const usersDB = await userDatabase.findUsers(q as string | undefined);
        const users: User[] = usersDB.map((user: TUser) => {
            return new User(
                user.id,
                user.name,
                user.email,
                user.password,
                user.role,
                user.created_at
            );
        });
        res.status(200).send(users);
    } catch (error) {
        console.log(error);

        if (req.statusCode === 200) {
            res.status(500);
        }

        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send('Erro inesperado');
        }
    }
});

// POST:
app.post('/users', async (req: Request, res: Response) => {
    try {
        const { id, name, email, password, role, createdAt } = req.body;

        if (typeof id !== 'string') {
            res.status(400);
            throw new Error("'id' deve ser string");
        }

        if (typeof name !== 'string') {
            res.status(400);
            throw new Error("'name' deve ser string");
        }

        if (typeof email !== 'string') {
            res.status(400);
            throw new Error("'email' deve ser string");
        }

        if (typeof password !== 'string') {
            res.status(400);
            throw new Error("'password' deve ser string");
        }

        if (typeof role !== 'string') {
            res.status(400);
            throw new Error("'role' deve ser string");
        }

        if (typeof createdAt !== 'string') {
            res.status(400);
            throw new Error("'createdAt' deve ser string");
        }

        const userDatabase = new UserDatabase();
        const userDBExists = await userDatabase.findUserById(id);
        const currentDate = new Date();

        if (userDBExists) {
            res.status(400);
            throw new Error("'id' já existe");
        }

        const video = new User(
            id,
            name,
            email,
            password,
            role,
            format(currentDate, 'dd-MM-yyyy HH:mm:ss')
        );

        const newUser: TUser = {
            id: video.getId(),
            name: video.getName(),
            email: video.getEmail(),
            password: video.getPassword(),
            role: video.getRole(),
            created_at: video.getUpdatedAt(),
        };

        await userDatabase.insertUser(newUser);

        res.status(201).send({
            message: 'Usuário criado com sucesso',
            newUser,
        });
    } catch (error) {
        console.log(error);

        if (req.statusCode === 200) {
            res.status(500);
        }

        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send('Erro inesperado');
        }
    }
});

// PUT:
app.put('/users/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const newId = req.body.id as string;
        const newName = req.body.name as string;
        const newEmail = req.body.email as string;
        const newPassword = req.body.password as string;
        const newRole = req.body.role as string;
        const newCreatedAt = req.body.createdAt as string;

        const userDatabase = new UserDatabase();
        const userDBExists = await userDatabase.findUserById(id);

        if (!userDBExists) {
            res.status(400);
            throw new Error("'id' não encontrado");
        }

        const user = new User(
            userDBExists.id,
            userDBExists.name,
            userDBExists.email,
            userDBExists.password,
            userDBExists.role,
            userDBExists.created_at
        );

        // if (typeof newId !== 'string') {
        //     res.status(400);
        //     throw new Error("'id' deve ser string");
        // }

        if (typeof newName !== 'string') {
            res.status(400);
            throw new Error("'name' deve ser string");
        }

        if (typeof newEmail !== 'string') {
            res.status(400);
            throw new Error("'email' deve ser string");
        }

        if (typeof newPassword !== 'string') {
            res.status(400);
            throw new Error("'password' deve ser string");
        }

        if (typeof newRole !== 'string') {
            res.status(400);
            throw new Error("'role' deve ser string");
        }

        if (typeof newCreatedAt !== 'string') {
            res.status(400);
            throw new Error("'createdAt' deve ser string");
        }

        newId && user.setId(newId);
        newName && user.setName(newName);
        newEmail && user.setEmail(newEmail);
        newPassword && user.setPassword(newPassword);
        newRole && user.setRole(newRole);
        newCreatedAt && user.setUpdatedAt(newCreatedAt);

        const newUser: TUser = {
            id: user.getId(),
            name: user.getName(),
            email: user.getEmail(),
            password: user.getPassword(),
            role: user.getRole(),
            created_at: user.getUpdatedAt(),
        };

        console.log(newUser);

        await userDatabase.updateUserById(id, newUser);

        res.status(200).send({
            message: 'User atualizado com sucesso',
            newUser,
        });
    } catch (error) {
        console.log(error);

        if (req.statusCode === 200) {
            res.status(500);
        }

        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send('Erro inesperado');
        }
    }
});

// DELETE:
app.delete('/users/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const userDatabase = new UserDatabase();
        const userDBExists = await userDatabase.findUserById(id);

        if (!userDBExists) {
            res.status(400);
            throw new Error("'id' não existe");
        }

        const user = new User(
            userDBExists.id,
            userDBExists.name,
            userDBExists.email,
            userDBExists.password,
            userDBExists.role,
            userDBExists.created_at
        );

        await userDatabase.deleteUserById(user.getId());
        res.status(200).send({ message: 'User deletado com sucesso' });
    } catch (error) {
        console.log(error);

        if (req.statusCode === 200) {
            res.status(500);
        }

        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send('Erro inesperado');
        }
    }
});

// --> POSTS <--

// GET:
app.get('/posts', async (req: Request, res: Response) => {
    try {
        const q = req.query.q;

        const postDataBase = new PostDatabase();
        const postsDB = await postDataBase.findPosts(q as string | undefined);

        const posts: Post[] = postsDB.map((post: TPost) => {
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
        // console.log(posts);

        res.status(200).send(posts);
    } catch (error) {
        console.log(error);

        if (req.statusCode === 200) {
            res.status(500);
        }

        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send('Erro inesperado');
        }
    }
});

// POST:
app.post('/posts', async (req: Request, res: Response) => {
    try {
        const {
            id,
            creatorId,
            content,
            likes,
            dislikes,
            createdAt,
            updatedAt,
        } = req.body;

        if (typeof id !== 'string') {
            res.status(400);
            throw new Error("'id' deve ser string");
        }

        if (typeof creatorId !== 'string') {
            res.status(400);
            throw new Error("'creatorId' deve ser string");
        }

        if (typeof content !== 'string') {
            res.status(400);
            throw new Error("'content' deve ser string");
        }

        if (typeof likes !== 'number') {
            res.status(400);
            throw new Error("'likes' deve ser number");
        }

        if (typeof dislikes !== 'number') {
            res.status(400);
            throw new Error("'dislikes' deve ser number");
        }

        if (typeof createdAt !== 'string') {
            res.status(400);
            throw new Error("'createdAt' deve ser string");
        }

        if (typeof updatedAt !== 'string') {
            res.status(400);
            throw new Error("'updatedAt' deve ser string");
        }

        const postDatabase = new PostDatabase();
        const postDBExists = await postDatabase.findPostById(id);
        const currentDate = new Date();

        if (postDBExists) {
            res.status(400);
            throw new Error("'id' já existe");
        }

        const video = new Post(
            id,
            creatorId,
            content,
            likes,
            dislikes,
            format(currentDate, 'dd-MM-yyyy HH:mm:ss'),
            format(currentDate, 'dd-MM-yyyy HH:mm:ss')
        );

        const newPost: TPost = {
            id: video.getId(),
            creator_id: video.getCreatedId(),
            content: video.getContent(),
            likes: video.getLikes(),
            dislikes: video.getDislikes(),
            created_at: video.getCreatedAt(),
            updated_at: video.getUpdatedAt(),
        };

        await postDatabase.insertPost(newPost);

        res.status(201).send({
            message: 'Post criado com sucesso',
            newPost,
        });
    } catch (error) {
        console.log(error);

        if (req.statusCode === 200) {
            res.status(500);
        }

        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send('Erro inesperado');
        }
    }
});

// PUT:
app.put('/posts/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const newId = req.body.id as string;
        const newCreatorId = req.body.creatorId as string;
        const newContent = req.body.content as string;
        const newLikes = req.body.likes as number;
        const newDislikes = req.body.dislikes as number;
        const newCreatedAt = req.body.createdAt as string;
        const newUpdatedAt = req.body.updatedAt as string;

        const postDatabase = new PostDatabase();
        const postDBExists = await postDatabase.findPostById(id);

        if (!postDBExists) {
            res.status(400);
            throw new Error("'id' não encontrado");
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

        if (typeof newId !== 'string') {
            res.status(400);
            throw new Error("'id' deve ser string");
        }

        if (typeof newCreatorId !== 'string') {
            res.status(400);
            throw new Error("'creatorId' deve ser string");
        }

        if (typeof newContent !== 'string') {
            res.status(400);
            throw new Error("'content' deve ser string");
        }

        if (typeof newLikes !== 'number') {
            res.status(400);
            throw new Error("'likes' deve ser number");
        }

        if (typeof newDislikes !== 'number') {
            res.status(400);
            throw new Error("'dislikes' deve ser number");
        }

        if (typeof newCreatedAt !== 'string') {
            res.status(400);
            throw new Error("'createdAt' deve ser string");
        }

        if (typeof newUpdatedAt !== 'string') {
            res.status(400);
            throw new Error("'updatedAt' deve ser string");
        }

        newId && post.setId(newId);
        newCreatorId && post.setCreatedId(newCreatorId);
        newContent && post.setContent(newContent);
        newLikes && post.setLikes(newLikes);
        newDislikes && post.setDislikes(newDislikes);
        newCreatedAt && post.setCreatedAt(newCreatedAt);
        newUpdatedAt && post.setUpdatedAt(newUpdatedAt);

        const newPost: TPost = {
            id: post.getId(),
            creator_id: post.getCreatedId(),
            content: post.getContent(),
            likes: post.getLikes(),
            dislikes: post.getDislikes(),
            created_at: post.getCreatedAt(),
            updated_at: post.getUpdatedAt(),
        };

        await postDatabase.updatePostById(id, newPost);

        res.status(200).send({
            message: 'Post atualizado com sucesso',
            newPost,
        });
    } catch (error) {
        console.log(error);

        if (req.statusCode === 200) {
            res.status(500);
        }

        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send('Erro inesperado');
        }
    }
});

// DELETE:
app.delete('/posts/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        const postDatabase = new PostDatabase();
        const postDBExists = await postDatabase.findPostById(id);

        if (!postDBExists) {
            res.status(400);
            throw new Error("'id' não existe");
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

        await postDatabase.deletePostById(post.getId());
        res.status(200).send({ message: 'Post deletado com sucesso' });
    } catch (error) {
        console.log(error);

        if (req.statusCode === 200) {
            res.status(500);
        }

        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send('Erro inesperado');
        }
    }
});
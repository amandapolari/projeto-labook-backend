import express, { Request, Response } from 'express';
import cors from 'cors';
// import { UserController } from './controller/UserController';
// import { PostController } from './controller/PostController';
import { userRouter } from './router/userRouter';

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

// --> INSTÂNCIAS <--

// const userController = new UserController();
// const postController = new PostController();

// --> USERS <--

app.use('/users', userRouter);

// GET:
// app.get('/users', userController.getUsers);

// POST:
// app.post('/users', userController.createUser);

// PUT:
// app.put('/users/:id', userController.updateUser);

// DELETE:
// app.delete('/users/:id', userController.deleteUser);

// --> POSTS <--

app.use('/posts', userRouter);

// GET:
// app.get('/posts', postController.getPosts);

// POST:
// app.post('/posts', postController.createPost);

// PUT:
// app.put('/posts/:id', postController.updatePost);

// DELETE:
// app.delete('/posts/:id', postController.deletePost);

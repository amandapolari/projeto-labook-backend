import { format } from 'date-fns';
import { UserDatabase } from '../database/UserDatabase';
import { TokenPayload, USER_ROLES, User, UserDB } from '../models/User';
import { BadRequestError } from '../errors/BadRequestError';
import { SignupInputDTO, SignupOutputDTO } from '../dtos/users/signupDto';
import { LoginInputDTO, LoginOutputDTO } from '../dtos/users/loginDto';
import { NotFoundError } from '../errors/NotFoundError';
import { IdGenerator } from '../services/IdGenerator';
import { TokenManager } from '../services/TokenManager';
import { HashManager } from '../services/HashManager';

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ) {}

    // GET => APENAS PARA AJUDAR A CODIFICAR | NÃO TEM ARQUITETURA APLICADA
    public getUsers = async (input: any) => {
        const { q, token } = input;

        const payload = this.tokenManager.getPayload(token);

        // console.log(payload);
        /*
        {
        id: '073a07d0-56b5-4cc1-9b01-09db47f7f301',
        name: 'Amanda',
        role: 'ADMIN',
        iat: 1700241882,
        exp: 1700846682
        }
        */

        if (payload === null) {
            throw new BadRequestError('token inválido');
        }

        if (payload.role !== USER_ROLES.ADMIN) {
            throw new BadRequestError(
                'Somente administradores podem acessar essa funcionalidade'
            );
        }

        const usersDB = await this.userDatabase.findUsers(
            q as string | undefined
        );

        const users: User[] = usersDB.map((user: UserDB) => {
            return new User(
                user.id,
                user.name,
                user.email,
                user.password,
                user.role,
                user.created_at
            );
        });

        const output = users;

        return output;
    };

    // SIGNUP (OBRIGATÓRIO)
    public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {
        const { name, email, password } = input;

        const id = this.idGenerator.generate();

        const userDBExists = await this.userDatabase.findUserById(id);

        if (userDBExists) {
            throw new BadRequestError("'id' já existe");
        }

        const hashPassword = await this.hashManager.hash(password);

        const user = new User(
            id,
            name,
            email,
            hashPassword,
            USER_ROLES.NORMAL,
            // Somente para teste:
            // USER_ROLES.ADMIN,
            format(new Date(), 'dd-MM-yyyy HH:mm:ss')
        );

        const newUser: UserDB = {
            id: user.getId(),
            name: user.getName(),
            email: user.getEmail(),
            password: user.getPassword(),
            role: user.getRole(),
            created_at: user.getUpdatedAt(),
        };

        await this.userDatabase.insertUser(newUser);

        const payload: TokenPayload = {
            id: user.getId(),
            name: user.getName(),
            role: user.getRole() as USER_ROLES,
        };

        const token = this.tokenManager.createToken(payload);

        const output: SignupOutputDTO = {
            message: 'Usuário cadastrado com sucesso',
            token: token,
        };

        return output;
    };

    // LOGIN (OBRIGATÓRIO)
    public login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {
        const { email, password } = input;

        const userDB = await this.userDatabase.findUserByEmail(email);

        if (!userDB) {
            throw new NotFoundError("'email' não encontrado");
        }

        // o password hasheado está no banco de dados
        const hashedPassword = userDB.password;

        // o serviço hashManager analisa o password do body (plaintext) e o hash
        const isPasswordCorrect = await this.hashManager.compare(
            password,
            hashedPassword
        );

        // validamos o resultado
        if (!isPasswordCorrect) {
            throw new BadRequestError("'email' ou 'password' incorretos");
        }

        const user = new User(
            userDB.id,
            userDB.name,
            userDB.email,
            userDB.password,
            userDB.role,
            userDB.created_at
        );

        const payload: TokenPayload = {
            id: user.getId(),
            name: user.getName(),
            role: user.getRole() as USER_ROLES,
        };

        const token = this.tokenManager.createToken(payload);

        const output: LoginOutputDTO = {
            message: 'Login realizado com sucesso',
            token: token,
        };

        return output;
    };

    // UPDATE => APENAS PARA AJUDAR A CODIFICAR | NÃO TEM ARQUITETURA APLICADA
    public updateUser = async (input: any) => {
        const {
            id,
            newId,
            newName,
            newEmail,
            newPassword,
            newRole,
            newCreatedAt,
        } = input;

        const userDBExists = await this.userDatabase.findUserById(id);

        if (!userDBExists) {
            throw new BadRequestError("'id' não encontrado");
        }

        const user = new User(
            userDBExists.id,
            userDBExists.name,
            userDBExists.email,
            userDBExists.password,
            userDBExists.role,
            userDBExists.created_at
        );

        if (newId !== undefined) {
            if (typeof newId !== 'string') {
                throw new BadRequestError("'newId' deve ser string");
            }
        }

        if (newName !== undefined) {
            if (typeof newName !== 'string') {
                throw new BadRequestError("'newName' deve ser string");
            }
        }

        if (newEmail !== undefined) {
            if (typeof newEmail !== 'string') {
                throw new BadRequestError("'newEmail' deve ser string");
            }
        }

        if (newPassword !== undefined) {
            if (typeof newPassword !== 'string') {
                throw new BadRequestError("'newPassword' deve ser string");
            }
        }

        if (newRole !== undefined) {
            if (typeof newRole !== 'string') {
                throw new BadRequestError("'newRole' deve ser string");
            }
        }

        if (newCreatedAt !== undefined) {
            if (typeof newCreatedAt !== 'string') {
                // res.status(400);
                throw new BadRequestError("'newCreatedAt' deve ser string");
            }
        }

        newId && user.setId(newId);
        newName && user.setName(newName);
        newEmail && user.setEmail(newEmail);
        newPassword && user.setPassword(newPassword);
        newRole && user.setRole(newRole);
        newCreatedAt && user.setUpdatedAt(newCreatedAt);

        const newUser: UserDB = {
            id: user.getId(),
            name: user.getName(),
            email: user.getEmail(),
            password: user.getPassword(),
            role: user.getRole(),
            created_at: user.getUpdatedAt(),
        };

        await this.userDatabase.updateUserById(id, newUser);

        const output = {
            message: 'Usuário atualizado com sucesso',
            user: user,
        };

        return output;
    };

    // DELETE => APENAS PARA AJUDAR A CODIFICAR | NÃO TEM ARQUITETURA APLICADA
    public deleteUser = async (input: any) => {
        const { id } = input;

        const userDBExists = await this.userDatabase.findUserById(id);

        if (!userDBExists) {
            throw new BadRequestError("'id' não existe");
        }

        const user = new User(
            userDBExists.id,
            userDBExists.name,
            userDBExists.email,
            userDBExists.password,
            userDBExists.role,
            userDBExists.created_at
        );

        await this.userDatabase.deleteUserById(id);

        const output = {
            message: 'Usuário deletado com sucesso',
        };

        return output;
    };
}

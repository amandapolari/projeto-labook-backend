import { format } from 'date-fns';
import { UserDatabase } from '../database/UserDatabase';
import { TokenPayload, USER_ROLES, User } from '../models/User';
import { BadRequestError } from '../errors/BadRequestError';
import { SignupInputDTO, SignupOutputDTO } from '../dtos/users/signupDto';
import { LoginInputDTO, LoginOutputDTO } from '../dtos/users/loginDto';
import { NotFoundError } from '../errors/NotFoundError';
import { IdGenerator } from '../services/IdGenerator';
import { TokenManager } from '../services/TokenManager';
import { HashManager } from '../services/HashManager';
import { GetUsersInputDTO } from '../dtos/users/getUsersDto';

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ) {}

    // GET => Endpoint para teste protegido para somente administradores poderem utilizar:
    public getUsers = async (input: GetUsersInputDTO) => {
        const { q, token } = input;

        const payload = this.tokenManager.getPayload(token);

        if (payload === null) {
            throw new BadRequestError(
                'É necessário um token para acessar essa funcionalidade'
            );
        }

        if (payload.role !== USER_ROLES.ADMIN) {
            throw new BadRequestError(
                'Somente administradores podem acessar essa funcionalidade'
            );
        }

        const usersDB = await this.userDatabase.findUsers(
            q as string | undefined
        );

        const users = usersDB.map((userDB) => {
            const user = new User(
                userDB.id,
                userDB.name,
                userDB.email,
                userDB.password,
                userDB.role,
                userDB.created_at
            );
            return user.toBusinessModel();
        });

        const output = users;

        return output;
    };

    // SIGNUP
    public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {
        const { name, email, password } = input;

        const id = this.idGenerator.generate();

        const userDBExists = await this.userDatabase.findUserById(id);

        if (userDBExists) {
            throw new BadRequestError("'id' já existe");
        }

        const hashPassword = await this.hashManager.hash(password);

        const newUser = new User(
            id,
            name,
            email,
            hashPassword,
            USER_ROLES.NORMAL,
            format(new Date(), 'dd-MM-yyyy HH:mm:ss')
        );

        const newUserDB = newUser.toDBModel();

        await this.userDatabase.insertUser(newUserDB);

        const payload: TokenPayload = {
            id: newUser.getId(),
            name: newUser.getName(),
            role: newUser.getRole() as USER_ROLES,
        };

        const token = this.tokenManager.createToken(payload);

        const output: SignupOutputDTO = {
            message: 'Usuário cadastrado com sucesso',
            token,
        };

        return output;
    };

    // LOGIN
    public login = async (input: LoginInputDTO): Promise<LoginOutputDTO> => {
        const { email, password } = input;

        const userDB = await this.userDatabase.findUserByEmail(email);

        if (!userDB) {
            throw new NotFoundError("'email' não encontrado");
        }

        const hashedPassword = userDB.password;

        const isPasswordCorrect = await this.hashManager.compare(
            password,
            hashedPassword
        );

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
}

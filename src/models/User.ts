export interface UserDB {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    created_at: string;
}

export interface UserModel {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    createdAt: string;
}

export enum USER_ROLES {
    NORMAL = 'NORMAL',
    ADMIN = 'ADMIN',
}

export interface TokenPayload {
    id: string;
    name: string;
    role: USER_ROLES;
}

export class User {
    constructor(
        protected id: string,
        protected name: string,
        protected email: string,
        protected password: string,
        protected role: string,
        protected createdAt: string
    ) {}

    public getId(): string {
        return this.id;
    }

    public getName(): string {
        return this.name;
    }

    public getEmail(): string {
        return this.email;
    }

    public getPassword(): string {
        return this.password;
    }

    public getRole(): string {
        return this.role;
    }

    public getUpdatedAt(): string {
        return this.createdAt;
    }

    public setId(id: string): void {
        this.id = id;
    }

    public setName(name: string): void {
        this.name = name;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public setPassword(password: string): void {
        this.password = password;
    }

    public setRole(role: string): void {
        this.role = role;
    }

    public setUpdatedAt(createdAt: string): void {
        this.createdAt = createdAt;
    }

    public toDBModel(): UserDB {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            password: this.password,
            role: this.role,
            created_at: this.createdAt,
        };
    }

    public toBusinessModel(): UserModel {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            password: this.password,
            role: this.role,
            createdAt: this.createdAt,
        };
    }
}

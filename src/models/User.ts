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
}

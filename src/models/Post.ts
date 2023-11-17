export interface PostDB {
    id: string;
    creator_id: string;
    content: string;
    likes: number;
    dislikes: number;
    created_at: string;
    updated_at: string;
}

export interface PostModel {
    id: string;
    creator_id: string;
    content: string;
    likes: number;
    dislikes: number;
    created_at: string;
    updatedAt: string;
}

export class Post {
    constructor(
        protected id: string,
        protected creatorId: string,
        protected content: string,
        protected likes: number,
        protected dislikes: number,
        protected createdAt: string,
        protected updatedAt: string
    ) {}

    public getId(): string {
        return this.id;
    }

    public getCreatedId(): string {
        return this.creatorId;
    }

    public getContent(): string {
        return this.content;
    }

    public getLikes(): number {
        return this.likes;
    }

    public getDislikes(): number {
        return this.dislikes;
    }

    public getCreatedAt(): string {
        return this.createdAt;
    }

    public getUpdatedAt(): string {
        return this.updatedAt;
    }

    public setId(id: string): void {
        this.id = id;
    }

    public setCreatedId(creatorId: string): void {
        this.creatorId = creatorId;
    }

    public setContent(content: string): void {
        this.content = content;
    }

    public setLikes(likes: number): void {
        this.likes = likes;
    }

    public setDislikes(dislikes: number): void {
        this.dislikes = dislikes;
    }

    public setCreatedAt(createdAt: string): void {
        this.createdAt = createdAt;
    }

    public setUpdatedAt(updatedAt: string): void {
        this.updatedAt = updatedAt;
    }
}

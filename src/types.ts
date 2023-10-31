export interface TUser {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    created_at: string;
}

export interface TPost {
    id: string;
    creator_id: string;
    content: string;
    likes: number;
    dislikes: number;
    created_at: string;
    updated_at: string;
}

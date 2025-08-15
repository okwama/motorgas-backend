export declare enum UserRole {
    ADMIN = "admin",
    USER = "user"
}
export declare class User {
    id: number;
    username: string;
    password: string;
    email: string;
    role: UserRole;
    created_at: Date;
    updated_at: Date;
}

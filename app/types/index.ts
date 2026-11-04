export enum Role{
    ADMIN = "ADMIN",
    USER = "USER",  
    GUEST = "GUEST",
    MANAGER= "MANAGER"
}

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: Role;
    teamId?: string;
    team?:Team;
    createdAt: Date;
    updatedAt: Date;
}

export type SafeUser = Omit<User, "password">;

export interface Team {
    id: string;
    name: string;
    description?: string;
    code: string;
    members?: User[];
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthContextType {
    user : User | null,
    login: (formData: FormData) => void;
    logout: () => void,
    hasPermission: (requiredRole: Role) => boolean
}
export type UserRole = 'admin' | 'technician' | 'customer';

export type User = {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    role: UserRole;
    avatar?: string | null;
    email_verified_at: string | null;
    created_at?: string;
    updated_at?: string;
};

export type Auth = {
    user: User | null;
};

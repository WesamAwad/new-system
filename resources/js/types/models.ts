export type TicketPriority = 'low' | 'medium' | 'high' | 'emergency';
export type TicketStatus =
    | 'pending'
    | 'assigned'
    | 'in_progress'
    | 'completed'
    | 'cancelled';

export type Category = {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    icon?: string | null;
    base_price: string | number;
    is_active?: boolean;
};

export type WorkshopServiceItem = {
    id: number;
    workshop_id: number;
    category_id: number;
    starting_price: string | number;
    category?: Pick<Category, 'id' | 'name' | 'slug'>;
};

export type WorkshopReview = {
    id: number;
    workshop_id: number;
    client_name: string;
    rating: number;
    comment: string;
    created_at: string;
};

export type Workshop = {
    id: number;
    user_id: number;
    name: string;
    logo: string | null;
    bio: string | null;
    city: string;
    address: string;
    rating: string | number;
    reviews_count: number;
    is_featured: boolean;
    is_available: boolean;
    services?: WorkshopServiceItem[];
    reviews?: WorkshopReview[];
};

export type TicketUser = {
    id: number;
    name: string;
    email?: string;
    phone?: string | null;
    role?: string;
};

export type TicketUpdate = {
    id: number;
    ticket_id: number;
    user_id: number;
    message: string;
    status_from: string | null;
    status_to: string | null;
    is_internal: boolean;
    created_at: string;
    user?: TicketUser;
};

export type Ticket = {
    id: number;
    ticket_number: string;
    user_id: number;
    category_id: number;
    assigned_to: number | null;
    title: string;
    description: string;
    address: string;
    priority: TicketPriority;
    status: TicketStatus;
    estimated_cost: string | number | null;
    scheduled_at: string | null;
    completed_at: string | null;
    created_at: string;
    updated_at: string;
    category?: Pick<Category, 'id' | 'name' | 'slug'>;
    customer?: TicketUser;
    assignee?: TicketUser | null;
    updates?: TicketUpdate[];
};

export type Paginated<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    path: string;
    first_page_url: string | null;
    last_page_url: string | null;
    next_page_url: string | null;
    prev_page_url: string | null;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
};

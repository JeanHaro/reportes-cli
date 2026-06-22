export enum Priority {
    High = 1,
    Medium,
    Low
}

export enum Category {
    Frontend = 1,
    Backend,
    Architecture,
    Tools
}

export interface Report {
    id: number;
    title: string;
    author: string;
    priority: Priority;
    category: Category;
    tags: string[];
    createdAt: string;
}


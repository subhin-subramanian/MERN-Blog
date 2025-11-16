export interface Post {
    _id?: string;
    userId?: string;
    title: string;
    category: string;
    image: string;
    content: string;
    slug?: string;
    createdAt?: string;
    updatedAt?: string;
}
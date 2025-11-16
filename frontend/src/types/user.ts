export interface User {
    _id: string;
    username: string;
    email: string;
    password?: string;
    profilePic?: string;
    isAdmin: string;
    createdAt?: string;
    updatedAt?: string;
}
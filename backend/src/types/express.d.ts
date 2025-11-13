import type { Request } from "express";

//Extend express request to include 'user' from verifyToken Middleware
export interface AuthenticatedRequest extends Request {
    user?:{
        id: string;
        isAdmin: boolean;
    };
}
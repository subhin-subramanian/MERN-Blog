import type { NextFunction, Request, Response } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';


interface AuthenticatedRequest extends Request {
    user?:string | JwtPayload;
}

export const verifyToken =(req:AuthenticatedRequest ,res:Response ,next:NextFunction): Response | void => {

    const token = req.cookies?.access_token;
    if(!token){
        return (res.status(404).json('Wrong credentials'));
    }
    jwt.verify(token, process.env.JWT_SECRET as string,(err: jwt.VerifyErrors | null ,user: string | jwt.JwtPayload | undefined) => {
        if(err){
            return (res.status(405).json('Unauthorized'));
        }
        req.user=user;
        next();
    });
}
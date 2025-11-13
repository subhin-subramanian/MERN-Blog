import express, { type RequestHandler } from 'express';
import { deleteUser, getUser, getUsers, googleSignIn, googleSignUp, signIn, signOut, signUp, updateUser } from '../controllers/user.controllers.js';
import { verifyToken } from '../utils/verifytoken.js';

const userRouter = express.Router();

userRouter.post('/sign-up',signUp as RequestHandler);
userRouter.post('/sign-up/google',googleSignUp as RequestHandler);
userRouter.post('/sign-in',signIn as RequestHandler);
userRouter.post('/sign-in/google',googleSignIn as RequestHandler);
userRouter.put('/update/:userId',verifyToken as RequestHandler,updateUser as RequestHandler);
userRouter.delete('/delete/:userId',verifyToken as RequestHandler,deleteUser as RequestHandler);
userRouter.post('/sign-out',signOut as RequestHandler);
userRouter.get('/getusers',verifyToken as RequestHandler,getUsers as RequestHandler);
userRouter.get('/getuser/:userId',getUser as RequestHandler);

export default userRouter;
import express from 'express';
import { deleteUser, getUser, getUsers, googleSignIn, googleSignUp, signIn, signOut, signUp, updateUser } from '../controllers/user.controllers.js';
import { verifyToken } from '../utils/verifytoken.js';

const userRouter = express.Router();

userRouter.post('/sign-up',signUp);
userRouter.post('/sign-up/google',googleSignUp)
userRouter.post('/sign-in',signIn);
userRouter.post('/sign-in/google',googleSignIn)
userRouter.put('/update/:userId',verifyToken,updateUser);
userRouter.delete('/delete/:userId',verifyToken,deleteUser);
userRouter.post('/sign-out',signOut);
userRouter.get('/getusers',verifyToken,getUsers);
userRouter.get('/getuser/:userId',getUser);

export default userRouter;
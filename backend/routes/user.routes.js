import express from 'express';
import { deleteUser, getUsers, signIn, signOut, signUp, test, updateUser } from '../controllers/user.controllers.js';
import { verifyToken } from '../utils/verifytoken.js';

const userRouter = express.Router();

userRouter.get('/test',test);
userRouter.post('/sign-up',signUp);
userRouter.post('/sign-in',signIn);
userRouter.put('/update/:userId',verifyToken,updateUser);
userRouter.delete('/delete/:userId',verifyToken,deleteUser);
userRouter.post('/sign-out',signOut);
userRouter.get('/getusers',verifyToken,getUsers);

export default userRouter;
import express from 'express';
import { deleteUser, signIn, signOut, signUp, test, updateUser } from '../controllers/user.controllers.js';
import { verifyToken } from '../utils/verifytoken.js';

const userRouter = express.Router();

userRouter.get('/test',test);
userRouter.post('/sign-up',signUp);
userRouter.post('/sign-in',signIn);
userRouter.put('/update/:userId',verifyToken,updateUser);
userRouter.delete('/delete/:userId',verifyToken,deleteUser);
userRouter.post('/sign-out',signOut);

export default userRouter;
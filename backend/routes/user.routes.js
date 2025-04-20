import express from 'express';
import { deleteUser, signIn, signUp, test, updateUser } from '../controllers/user.controllers.js';
import { verifyToken } from '../utils/verifytoken.js';

const userRouter = express.Router();

userRouter.get('/test',test);
userRouter.post('/sign-up',signUp);
userRouter.post('/sign-in',signIn);
userRouter.put('/update/:userId',verifyToken,updateUser);
userRouter.delete('/delete/:userId',verifyToken,deleteUser);

export default userRouter;
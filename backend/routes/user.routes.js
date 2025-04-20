import express from 'express';
import { signIn, signUp, test, updateUser } from '../controllers/user.controllers.js';
import { verifyToken } from '../utils/verifytoken.js';

const userRouter = express.Router();

userRouter.get('/test',test);
userRouter.post('/sign-up',signUp);
userRouter.post('/sign-in',signIn);
userRouter.put('/update/:userId',verifyToken,updateUser);

export default userRouter;
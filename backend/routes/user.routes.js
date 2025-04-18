import express from 'express';
import { signIn, signUp, test } from '../controllers/user.controllers.js';

const userRouter = express.Router();

userRouter.get('/test',test);
userRouter.post('/sign-up',signUp);
userRouter.get('/sign-in',signIn);


export default userRouter;
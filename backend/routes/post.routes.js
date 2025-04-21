import express from 'express';
import { verifyToken } from '../utils/verifytoken.js';
import { createPost } from '../controllers/post.controllers.js';


const postRouter = express.Router();

postRouter.post('/create',verifyToken,createPost)

export default postRouter;
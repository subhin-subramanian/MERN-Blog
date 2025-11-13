import express, { type RequestHandler } from 'express';
import { verifyToken } from '../utils/verifytoken.js';
import { createPost, deletePost, getPosts, updatePost } from '../controllers/post.controllers.js';

const postRouter = express.Router();

postRouter.post('/create',verifyToken as RequestHandler,createPost as RequestHandler);
postRouter.get('/getposts',getPosts as RequestHandler);
postRouter.delete('/delete/:postId/:userId',verifyToken as RequestHandler,deletePost as RequestHandler);
postRouter.put('/update/:postId/:userId',verifyToken as RequestHandler,updatePost as RequestHandler);

export default postRouter;
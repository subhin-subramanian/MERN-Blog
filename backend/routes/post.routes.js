import express from 'express';
import { verifyToken } from '../utils/verifytoken.js';
import { createPost, deletePost, getPosts } from '../controllers/post.controllers.js';

const postRouter = express.Router();

postRouter.post('/create',verifyToken,createPost);
postRouter.get('/getposts',getPosts);
postRouter.delete('/delete/:postId/:userId',verifyToken,deletePost);

export default postRouter;
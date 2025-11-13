import express, { type RequestHandler } from 'express';
import { verifyToken } from '../utils/verifytoken.js';
import { createComment, deleteComment, editComment, getAllComments, getComments, likeComment } from '../controllers/comment.controllers.js';

const commentRouter = express.Router(); 

commentRouter.post('/create',verifyToken as RequestHandler,createComment as RequestHandler);
commentRouter.get('/getcomments/:postId',getComments as RequestHandler);
commentRouter.put('/likecomment/:commentId',verifyToken as RequestHandler,likeComment as RequestHandler);
commentRouter.put('/editcomment/:commentId',verifyToken as RequestHandler,editComment as RequestHandler);
commentRouter.delete('/deletecomment/:commentId',verifyToken as RequestHandler,deleteComment as RequestHandler)
commentRouter.get('/getallcomments',verifyToken as RequestHandler,getAllComments as RequestHandler);

export default commentRouter;

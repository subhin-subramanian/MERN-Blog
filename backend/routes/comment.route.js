import express from 'express';
import { verifyToken } from '../utils/verifytoken.js';
import { createComment, deleteComment, editComment, getAllComments, getComments, likeComment } from '../controllers/comment.controllers.js';

const commentRouter = express.Router(); 

commentRouter.post('/create',verifyToken,createComment);
commentRouter.get('/getcomments/:postId',getComments);
commentRouter.put('/likecomment/:commentId',verifyToken,likeComment);
commentRouter.put('/editcomment/:commentId',verifyToken,editComment);
commentRouter.delete('/deletecomment/:commentId',verifyToken,deleteComment)
commentRouter.get('/getallcomments',verifyToken,getAllComments);

export default commentRouter;

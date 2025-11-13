import type { Request, Response } from "express";
import Comment from "../models/comment.model.js";
import type { AuthenticatedRequest } from "../types/express.js";
import type { ApiResponse } from "../types/response.js";

// Function for creating a new comment
export const createComment = async(req:AuthenticatedRequest, res:Response<ApiResponse>): Promise <Response> => {
    const {content,postId} = req.body;
    const userId =  req.user?.id;
    try {
        const comment = new Comment({content,postId,userId});
        await comment.save();
        return res.status(200).json({success:true,data:comment});
    } catch (error:any) {
        return res.status(500).json({success:false,message: error.errmsg || 'server error'});
    }
}

// Getting all the comments of a post to render in the post page
export const getComments = async(req:Request, res:Response<ApiResponse>): Promise <Response> => {
    try {
        const comments = await Comment.find({postId:req.params.postId}).sort({createdAt:-1});
        return res.status(200).json({success:true,data:comments});
    } catch (error:any) {
        return res.status(500).json({success:false,message: error.errmsg || 'server error'});
    }
}

// Updating the no. of like for a comment
export const likeComment = async(req:AuthenticatedRequest, res:Response<ApiResponse>): Promise <Response> => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            return res.status(407).json({success:false,message:"Comment not found"});
        }
        if(!req.user?.id) return res.status(401).json({success:false,message:"Unauthorized"})
        const userIndex = comment.likes.indexOf(req.user.id);
        if(userIndex === -1){
            comment.numberOfLikes += 1;
            comment.likes.push(req.user?.id);
        }else{
            comment.numberOfLikes = Math.max(comment.numberOfLikes - 1, 0);
            comment.likes.splice(userIndex,1);
        }
        await comment.save();
        return res.status(200).json({success:true,data:comment}); 
    } catch (error:any) {
        return res.status(500).json({success:false,message: error.errmsg || 'server error'}); 
    }
}

// function to edit a comment
export const editComment = async(req:AuthenticatedRequest, res:Response<ApiResponse>): Promise <Response> => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            return res.status(407).json({success:false,message:"Comment not found"}); 
        }
        if(!req.user?.isAdmin && req.user?.id !== comment.userId ){
             return res.status(407).json({success:false,message:"You can't edit this comment"});
        }
        const editedComment = await Comment.findByIdAndUpdate(req.params.commentId,{content:req.body.content},{new:true});
        return res.status(200).json({success:true,data:editedComment}); 
    } catch (error:any) {
        return res.status(500).json({success:false,message: error.errmsg || 'server error'}); 
    }
}

// function to delete a comment
export const deleteComment = async(req:AuthenticatedRequest, res:Response<ApiResponse>): Promise <Response> => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            return res.status(407).json({success:false,message:"Comment not found"}); 
        }
        if(!req.user?.isAdmin && req.user?.id !== comment.userId ){
             return res.status(407).json({success:false,message:"You can't delete this comment"});
        }
        const deletedComment = await Comment.findByIdAndDelete(req.params.commentId);
        return res.status(200).json({success:false,message:'comment deleted'}); 
    } catch (error:any) {
        return res.status(500).json({success:false,message: error.errmsg || 'server error'}); 
    }
}

// Function to fetch all comments for admin dashboard
export const getAllComments = async(req:AuthenticatedRequest, res:Response<ApiResponse>): Promise <Response> => {
    if(!req.user?.isAdmin){
        return res.status(407).json({success:false,message:"You can't see all the comments"});
    }
    try {
      const startIndex = req.query.startIndex ? parseInt(req.query.startIndex as string,10) : 0;
      const limit = parseInt(req.query.limit as string) || 9;
      const sortDirection = req.query.order === 'asc' ? 1 : -1;
      const comments = await Comment.find().sort({createdAt:sortDirection}).skip(startIndex).limit(limit);

      const totalComments = await Comment.countDocuments();
      const now = new Date();
      const oneMonthAgo = new Date(now.getFullYear(),now.getMonth()-1,now.getDate());
      const lastMonthComments = await Comment.countDocuments({createdAt:{$gte:oneMonthAgo}});

      return res.status(200).json({success:true, data:{comments,totalComments,lastMonthComments}});       
    } catch (error:any) {
      return res.status(500).json({success:false,message: error.errmsg || 'server error'});  
    }
}
import type { Request, Response } from "express";
import Post from "../models/post.model.js";
import type { AuthenticatedRequest } from "../types/express.js";
import type { ApiResponse } from "../types/response.js";

// Function to create a new post
export const createPost = async (req:AuthenticatedRequest ,res:Response<ApiResponse>): Promise <Response> => {
    if(!req.user?.isAdmin){
        return res.status(407).json({success:false, message:"You can't create a post"});
    }
    if(!req.body.title || !req.body.content){
        return res.status(408).json({success:false, message:'Title and content is required'});
    }
    const slug = req.body.title.split('').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g,'-');

    const newPost = new Post({...req.body,slug,userId:req.user.id});

    try{
        const savedPost = await newPost.save();
        return res.status(201).json({success:true, datafromBknd:savedPost});
    }catch(error:any){
        return res.status(500).json({success:false,message: error.errmsg || 'server error'});
    }
}

// Function to get posts from database as per the search or for renderings
export const getPosts = async (req:Request ,res:Response<ApiResponse>): Promise <Response> => {
    try {
        const startIndex = req.query.startIndex ? parseInt(req.query.startIndex as string, 10) : 0;
        const limit = parseInt(req.query.limit as string) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        const posts = await Post.find({
            ...(req.query.userId && {userId:req.query.userId}),
            ...(req.query.category && {category:req.query.category}),
            ...(req.query.slug && {slug:req.query.slug}),
            ...(req.query.postId && {_id:req.query.postId}),
            ...(req.query.searchTerm && {
                $or:[
                    {title:{$regex:req.query.searchTerm,$options:'i'}},
                    {content:{$regex:req.query.searchTerm,$options:'i'}}
                ]
            })
        }).sort({updatedAt:sortDirection}).skip(startIndex).limit(limit);

        const totalPosts = await Post.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(),now.getMonth()-1,now.getDate());
        const lastMonthPosts = await Post.countDocuments({createdAt:{$gte:oneMonthAgo}});

        return res.status(200).json({success:true, datafromBknd:{posts,totalPosts,lastMonthPosts}});
    } catch (error:any) {
        return res.status(500).json({success:false,message: error.errmsg || 'server error'});   
    }
}

// function to delete a post
export const deletePost = async (req:AuthenticatedRequest ,res:Response<ApiResponse>): Promise <Response> => {
    if(!req.user?.isAdmin || req.user?.id !== req.params.userId ){
        return res.status(407).json({success:false, message:"You can't delete the post"});
    }
    try {
        await Post.findByIdAndDelete(req.params.postId);
        return res.status(200).json({success:true, message:'Post deleted'});
    } catch (error:any) {
        return res.status(500).json({success:false,message: error.errmsg || 'server error'});
    }
}

// function to edit a post
export const updatePost = async (req:AuthenticatedRequest ,res:Response<ApiResponse>): Promise <Response> => {
    if(!req.user?.isAdmin || req.user?.id !== req.params.userId ){
        return res.status(407).json({success:false, message:"You can't edit the post"});
    }
    try {
      const updatedPost = await Post.findByIdAndUpdate(req.params.postId,{
        $set:{
            title:req.body.title,
            category:req.body.category,
            image:req.body.image,
            content:req.body.content
        }
      },{new:true});
      return res.status(200).json({success:true, datafromBknd:updatedPost});
    } catch (error:any) {
      return res.status(500).json({success:false,message: error.errmsg || 'server error'}); 
    }
}
import Post from "../models/post.model.js";

export const createPost = async(req,res)=>{
    if(!req.user.isAdmin){
        return res.status(407).json("You can't create a post");
    }
    if(!req.body.title || !req.body.content){
        return res.status(408).json('Title and content is required');
    }
    const slug = req.body.title.split('').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g,'-');

    const newPost = new Post({...req.body,slug,userId:req.user.id});

    try{
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    }catch(error){
        res.status(500).json({success:false,message: error.errmsg || 'server error'});
    }
}
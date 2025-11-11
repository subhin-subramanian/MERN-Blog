import Comment from "../models/comment.model.js";

// Function for creating a new comment
export const createComment = async(req,res)=>{
    const {content,postId,userId} = req.body;
    try {
        const comment = new Comment({content,postId,userId});
        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({success:false,message: error.errmsg || 'server error'});
    }
}

// Getting all the comments of a post to render in the post page
export const getComments = async(req,res)=>{
    try {
        const comments = await Comment.find({postId:req.params.postId}).sort({createdAt:-1});
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({success:false,message: error.errmsg || 'server error'});
    }
}

// Making changes in comment model as per the likes
export const likeComment = async(req,res)=>{
    try {
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            return res.status(407).json("Comment not found");
        }
        const userIndex = comment.likes.indexOf(req.user.id);
        if(userIndex === -1){
            comment.numberOfLikes += 1;
            comment.likes.push(req.user.id);
        }else{
            comment.numberOfLikes -= 1;
            comment.likes.splice(userIndex,1);
        }
        await comment.save();
        res.status(200).json(comment); 
    } catch (error) {
        res.status(500).json({success:false,message: error.errmsg || 'server error'}); 
    }
}

// function to edit a comment
export const editComment = async(req,res)=>{
    try {
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            return res.status(407).json("Comment not found"); 
        }
        if(!req.user.isAdmin && req.user.id !== comment.userId ){
             return res.status(407).json("You can't edit this comment");
        }
        const editedComment = await Comment.findByIdAndUpdate(req.params.commentId,{content:req.body.content},{new:true});
        res.status(200).json(editedComment); 
    } catch (error) {
        res.status(500).json({success:false,message: error.errmsg || 'server error'}); 
    }
}

// function to delete a comment
export const deleteComment = async(req,res)=>{
    try {
        const comment = await Comment.findById(req.params.commentId);
        if(!comment){
            return res.status(407).json("Comment not found"); 
        }
        if(!req.user.isAdmin && req.user.id !== comment.userId ){
             return res.status(407).json("You can't delete this comment");
        }
        const deletedComment = await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json('comment deleted'); 
    } catch (error) {
        res.status(500).json({success:false,message: error.errmsg || 'server error'}); 
    }
}

// Function to fetch all comments for admin dashboard
export const getAllComments = async(req,res)=>{
    if(!req.user.isAdmin){
        return res.status(407).json("You can't see all the comments");
    }
    try {
      const startIndex = parseInt(req.query.startIndex) ||0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.order === 'asc' ? 1 : -1;
      const comments = await Comment.find().sort({createdAt:sortDirection}).skip(startIndex).limit(limit);

      const totalComments = await Comment.countDocuments();
      const now = new Date();
      const oneMonthAgo = new Date(now.getFullYear(),now.getMonth()-1,now.getDate());
      const lastMonthComments = await Comment.countDocuments({createdAt:{$gte:oneMonthAgo}});

      res.status(200).json({comments,totalComments,lastMonthComments});       
    } catch (error) {
        res.status(500).json({success:false,message: error.errmsg || 'server error'});  
    }
}
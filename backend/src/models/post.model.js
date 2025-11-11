import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true,
        unique:true
    },
    category:{
        type:String,
        required:true,
        default:'uncategorized'
    },
    image:{
        type:String,
        default:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROn_UKKZe1L6P1cJKhcgRMv4LqxBk8MD1ZnQ&s'
    },
    content:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true,
        unique:true
    }

},{timestamps:true});

const Post = mongoose.model('Post',postSchema);

export default Post;
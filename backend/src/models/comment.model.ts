import { Schema, model, type Document } from "mongoose";

export interface IComment extends Document{
    content:string;
    postId:string;
    userId:string;
    likes:string[];
    numberOfLikes:number;
    createdAt?: Date;
    updatedAt?: Date;
}

const commentSchema = new Schema<IComment>({
    content:{
        type:String,
        required:true
    },
    postId:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    likes:{
        type:[Schema.Types.String],
        default:[]
    },
    numberOfLikes:{
        type:Number,
        default:0
    }
},{timestamps:true});

const Comment = model<IComment>('Comment',commentSchema);

export default Comment;
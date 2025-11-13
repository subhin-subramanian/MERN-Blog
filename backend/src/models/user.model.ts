import { Schema, model, type Document } from "mongoose";

//Defining the typescript interface
export interface IUser extends Document{
    username:string;
    email:string;
    password:string;
    profilePic?:string;
    isAdmin:boolean;
    createdAt?:Date;
    updatedAt?:Date;
}

//Defining the mongoose Schema
const userSchema = new Schema<IUser>({
    username:{
        type:String,
        required:true,
        unique: true,
    },
    email:{
        type: String, 
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    profilePic:{
        type:String,
        default:"https://img.freepik.com/premium-vector/man-avatar-profile-picture-isolated-background-avatar-profile-picture-man_1293239-4841.jpg?semt=ais_hybrid"
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
},{timestamps:true});

const User = model<IUser>('User',userSchema);

export default User;
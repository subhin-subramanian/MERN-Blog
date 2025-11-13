import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library';
import cloudinary from '../utils/cloudinary.js';
import dotenv from "dotenv";
import type { Request, Response } from 'express';
import type { AuthenticatedRequest } from '../types/express.js';
import type { ApiResponse } from '../types/response.js';
dotenv.config(); 

const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID);

// --------------------- SIGN UP ---------------------

export const signUp = async(req:Request,res:Response<ApiResponse>): Promise<Response | void> =>{
    const {username,email,password} = req.body;
    if(!username || !email || !password || username === '' || password === '' || email === ''){
        return res.status(400).json({success:false, message:'All fields are required'});
    }
    const hashedPassword = bcryptjs.hashSync(password,10);

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser){
        return res.status(401).json({success: false,message: "User already exists, try with different email"});
    }

    // If not, create new user
    const newUser = new User({username, email, password:hashedPassword})
    
    try {
        await newUser.save();
        return res.status(200).json({success:true, message:'Signup successfull'}); 
    } catch (error:any) {
        return res.status(500).json({success:false,message: error.errmsg || 'server error'});
    }
}

// --------------------- GOOGLE SIGNUP ---------------------

export const googleSignUp = async ( req:Request ,res:Response<ApiResponse>) : Promise<Response | void>=>{
    const { token,password } = req.body;
    if(!password || password === ''){
        return res.status(400).json({ success: false, message: "Even if you're using google account to signup, password is required. Please enter a password" });
    }
    const hashedPassword = bcryptjs.hashSync(password,10);

    let username:string, email:string, profilePic:string;

    try {
         //Verify google token
        const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        if (!payload) throw new Error("Invalid Google payload");
        username = payload.name || "Google user";
        email = payload.email || "";
        profilePic = payload.picture ? `${payload.picture}?sz=200` : "";
                
    } catch (err) {
    console.error("Google token verification failed:", err);
    return res.status(401).json({ success: false, message: "Invalid Google token" });
    }

    if(!email) return res.status(400).json({success:false, message: "Invalid Google account" });

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser){
        return res.status(401).json({success: false, message: "User already exists, try with different email"});
    }

    // If not, create new user
    try {
        //Save image to cloudinary
        let uploadedImageUrl = "";
        if(profilePic){
            const uploadResponse = await cloudinary.uploader.upload(profilePic,{ folder:"Blog_google_profiles"});
            uploadedImageUrl = uploadResponse.secure_url;
        }
        const newUser = new User({username, email, profilePic:uploadedImageUrl || profilePic, password:hashedPassword})
        await newUser.save();
        return res.status(200).json({success:true, message:'Signup successfull'});
    } catch (error:any) {
        console.error("Error during Google signup:", error);
        return res.status(500).json({success:false,message: error.errmsg || 'server error'});
    }
}

// --------------------- SIGN IN ---------------------

export const signIn = async (req:Request, res:Response<ApiResponse>): Promise<Response | void> =>{
    const {username,password} = req.body;
    if(!username || !password || password === '' || username === ''){
        return res.status(400).json({success:false, message:'All fields are required'});
    }
 
    try {
        // Checking with email, if user exists proceeds further otherwise returns
        const validUser = await User.findOne({username});
        if (!validUser){
            return res.status(403).json({success:false, message:'Wrong credentials'});
        }

        // Password checking
        const validPassword = bcryptjs.compareSync(password,validUser.password);
        if(!validPassword){
            return res.status(403).json({success:false, message:'Wrong credentials'});
        }

        // token creation
        const token = jwt.sign({id:validUser._id,isAdmin:validUser.isAdmin},process.env.JWT_SECRET as string);
        const {password:pass,...rest} = validUser.toObject();
        return res.status(200).cookie('access_token',token,{httpOnly:true}).json({success:true, data:rest});

    } catch (error:any) {
        return res.status(500).json({success:false,message: error.errmsg || 'server error'});
    }
}

// --------------------- GOOGLE SIGNIN ---------------------

export const googleSignIn = async (req:Request ,res:Response<ApiResponse>): Promise<Response | void> => {
    const { token,password } = req.body;
    if(!password || password === ''){
        return res.status(400).json({ success: false, message: "Even if you're using google account to signup, password is required. Please enter a password" });
    }

    let username: string ;

    try {
         //Verify google token
        const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        username = payload?.name || "Google Username";
                
    } catch (err) {
    console.error("Google token verification failed:", err);
    return res.status(401).json({ success: false, message: "Invalid Google token" });
    }

    try {
        // Checking with email, if user exists proceeds further otherwise returns
        const validUser = await User.findOne({username});
        if (!validUser){
            return res.status(403).json({success:false, message:'Wrong credentials'});
        }

        // Password checking
        const validPassword = bcryptjs.compareSync(password,validUser.password);
        if(!validPassword){
            return res.status(403).json({success:false, message:'Wrong credentials'});
        }

        // token creation
        const accessToken = jwt.sign({id:validUser._id,isAdmin:validUser.isAdmin},process.env.JWT_SECRET as string);
        const {password:pass,...rest} = validUser.toObject();
        return res.status(200).cookie('access_token',accessToken,{httpOnly:true}).json({success:true, data:rest});

    } catch (error:any) {
        return res.status(500).json({success:false,message: error.errmsg || 'server error'});
    }
}

// --------------------- UPDATE USER ---------------------

export const updateUser = async (req:AuthenticatedRequest, res:Response<ApiResponse>): Promise<Response | void> => {

    if(!req.user || req.user.id !== req.params.userId){
        return  res.status(401).json({success:false, message:"You're not authorized to update this user"});
    }

    if(req.body.password){
        if(req.body.password.length <6){
            return res.status(402).json({success:false, message:"Password must be more than 6 characters"});
        }
        req.body.password = bcryptjs.hashSync(req.body.password,10);
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId,{
            $set:{
                username:req.body.username,
                email:req.body.email,
                password:req.body.password,
                profilePic:req.body.profilePic}
        },{new:true});
        if(!updatedUser){
            return res.status(404).json({success:false, message:"User not found"});
        }    
        const {password,...rest} = updatedUser!.toObject();
        return res.status(200).json({success:true, data:rest});
    } catch (error:any) {
        return res.status(500).json({success:false,message: error.errmsg || 'server error'});
    }
}

// --------------------- DELETE ACCOUNT ---------------------

export const deleteUser = async (req:AuthenticatedRequest, res:Response<ApiResponse>): Promise<Response | void> => {
    if(!req.user){
        return res.status(404).json({success:false, message:"User not found"});
    }
    if(!req.user.isAdmin && (req.user.id != req.params.userId) ){
      return  res.status(401).json({success:false,message:"You're not authorized to delete this user"});
    }
    try {
      await User.findByIdAndDelete(req.params.userId);
      return res.status(200).json({success:true, message:'Account deleted'});     
    } catch (error:any) {
      return res.status(500).json({success:false,message: error.errmsg || 'server error'});   
    }
}

// --------------------- SIGN OUT ---------------------

export const signOut = async (req:Request, res:Response<ApiResponse>): Promise<Response | void> => {
    try {
        res.clearCookie('access_token').status(200).json({success:false, message:'User has been signed out'});
    } catch (error:any) {
        return res.status(500).json({success:false,message: error.errmsg || 'server error'});
    }
}

// Getting all the users for dashboard rendering

export const getUsers = async (req:AuthenticatedRequest, res:Response<ApiResponse>): Promise<Response | void> => {
    if(!req.user?.isAdmin){
        return res.status(407).json({success:false, message:"You can't see all the users"});
    }
    try {
        const startIndex = parseInt(req.query.startIndex as string) || 0;
        const limit = parseInt(req.query.limit as string) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 :-1;
        const users = await User.find({
            ...(req.query.username && {username:req.query.username}),
            ...(req.query.email && {email:req.query.email})
        }).sort({createdAt:sortDirection}).skip(startIndex).limit(limit);

        const totalUsers = await User.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(),now.getMonth()-1,now.getDate());
        const lastMonthUsers = await User.countDocuments({createdAt:{$gte:oneMonthAgo}});

        return res.status(200).json({success:true, data:{users,totalUsers,lastMonthUsers}});
    } catch (error:any) {
        return res.status(500).json({success:false,message: error.errmsg || 'server error'}); 
    }
}


// Getting the user of a comment for the comments section 

export const getUser = async (req:Request, res:Response<ApiResponse>): Promise<Response | void> => {
    try {
      const user = await User.findById(req.params.userId);
      if(!user){
        return res.status(408).json({success:false, message:"User not found"});
      }
      const {password,...rest} = user.toObject();
      return res.status(200).json({success:false, data:rest});
    } catch (error:any) {
      return res.status(500).json({success:false,message: error.errmsg || 'server error'}); 
    }
}
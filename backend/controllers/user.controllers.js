import bcryptjs from 'bcryptjs'
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken'

export const test = (req,res)=>{
    res.json('test-api is working');
}

// Function for sign-up route

export const signUp = async(req,res)=>{
    const {username,email,password} = req.body;
    if(!username || !email || !password || username === '' || password === '' || email === ''){
        return res.status(400).json('All fields are required');
    }
    const hashedPassword = bcryptjs.hashSync(password,10);

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser){
        return res.status(401).json({
            success: false,
            message: "User already exists, try with different email"
        });
    }

    // If not, create new user
    const newUser = new User({username, email, password:hashedPassword})
    
    try {
        await newUser.save();
        res.status(200).json('Signup successfull') 
    } catch (error) {
        res.status(500).json({success:false,message: error.errmsg || 'server error'});
    }
}

// Function for sign-in route   
export const signIn = async (req,res)=>{
    const {username,password} = req.body;
    if(!username || !password || password === '' || username === ''){
        return res.status(400).json('All fields are required');
    }
 
    try {
        // Checking with email, if user exists proceeds further otherwise returns
        const validUser = await User.findOne({username});
        if (!validUser){
            return res.status(403).json('Wrong credentials');
        }

        // Password checking
        const validPassword = bcryptjs.compareSync(password,validUser.password);
        if(!validPassword){
            return res.status(403).json('Wrong credentials');
        }

        // token creation
        const token = jwt.sign({id:validUser._id,isAdmin:validUser.isAdmin},process.env.JWT_SECRET);
        const {password:pass,...rest} = validUser._doc;
        res.status(200).cookie('access_token',token,{httpOnly:true}).json({rest});

    } catch (error) {
        res.status(500).json({success:false,message: error.errmsg || 'server error'});
    }
}

// Updating the user profile
export const updateUser = async (req,res)=>{

    if(req.user.id !== req.params.userId){
        return  res.status(401).json("You're not authorized to update this user");
    }

    if(req.body.password){
        if(req.body.password.length <6){
            return res.status(402).json("Password must be more than 6 characters");
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
        const {password,...rest} = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        res.status(500).json({success:false,message: error.errmsg || 'server error'});
    }
}

// Deleting the Account
export const deleteUser = async(req,res)=>{
    if(!req.user.isAdmin && (req.user.id != req.params.userId) ){
      return  res.status(401).json("You're not authorized to delete this user");
    }
    try {
      await User.findByIdAndDelete(req.params.userId);
      res.status(200).json('Account deleted');     
    } catch (error) {
        res.status(500).json({success:false,message: error.errmsg || 'server error'});   
    }
}

// Signing out 
export const signOut = async (req,res)=>{
    try {
        res.clearCookie('access_token').status(200).json('User has been signed out');
    } catch (error) {
        res.status(500).json({success:false,message: error.errmsg || 'server error'});
    }
}

// Getting all the users for dashboard rendering
export const getUsers = async(req,res)=>{
    if(!req.user.isAdmin){
        return res.status(407).json("You can't see all the users");
    }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.order === 'asc' ? 1 :-1;
        const users = await User.find({
            ...(req.query.username && {username:req.query.usrename}),
            ...(req.query.email && {email:req.query.email})
        }).sort({createdAt:sortDirection}).skip(startIndex).limit(limit);

        const totalUsers = await User.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(),now.getMonth()-1,now.getDate());
        const lastMonthUsers = await User.countDocuments({createdAt:{$gte:oneMonthAgo}});

        res.status(200).json({users,totalUsers,lastMonthUsers});
    } catch (error) {
        res.status(500).json({success:false,message: error.errmsg || 'server error'}); 
    }
}


// Getting the user of a comment for the comments section 
export const getUser = async (req,res,next)=>{
    try {
      const user = await User.findById(req.params.userId);
      if(!user){
        return res.status(408).json("User not found");
      }
      const {password,...rest} = user._doc;
      res.status(200).json(rest);
    } catch (error) {
        res.status(500).json({success:false,message: error.errmsg || 'server error'}); 
    }
}
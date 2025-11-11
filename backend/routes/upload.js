
import express from 'express';
import dotenv from 'dotenv';
import cloudinary from '../utils/cloudinary.js';

const router = express.Router();   

dotenv.config(); // Load environment variables

router.post('/', async (req,res)=>{
    try {
        const {image} = req.body;
        if(!image) return res.status(400).json({message: 'No image provided'});

        const result = await cloudinary.uploader.upload(image,{folder: 'MERN_Blog_CoverImgs'});
        res.status(200).json({imageUrl: result.secure_url});
    } 
    catch (error) {
        return res.status(500).json({message: 'Image upload failed due to internal server error'});  
    }
})

export default router;


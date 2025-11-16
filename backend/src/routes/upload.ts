import express, { type Request, type Response } from 'express';
import cloudinary from '../utils/cloudinary.js';
import type { ApiResponse } from '../types/response.js';

const router = express.Router();   

router.post('/', async (req:Request,res:Response<ApiResponse>): Promise<Response>=>{
    try {
        const {image} = req.body;
        if(!image) return res.status(400).json({success:false,message: 'No image provided'});

        const result = await cloudinary.uploader.upload(image,{folder: 'MERN_Blog_CoverImgs'});
        return res.status(200).json({success:true, datafromBknd:{imageUrl: result.secure_url}});
    } 
    catch (error) {
        return res.status(500).json({success:false, message: 'Image upload failed due to internal server error'});  
    }
})

export default router;


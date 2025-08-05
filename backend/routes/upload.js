// import express from 'express';
// import multer from 'multer';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const router = express.Router();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const storage = multer.diskStorage({
//     destination: (req,file,cb)=>{
//         cb(null,path.join(__dirname,'../uploads'));
//     },
//     filename:(req,file,cb) =>{
//         const ext = path.extname(file.originalname);
//         const uniqueName = `${Date.now()}-${Math.round(Math.random()*1e9)}${ext}`;
//         cb(null,uniqueName);
//     }
// });

// const upload = multer({storage});

// router.post('/',upload.single('image'),(req,res)=>{
//     if(!req.file){
//         return res.status(400).json({error: 'No file uploaded'});
//     }
//     const imageUrl = `http://localhost:3000/uploads/${req.file.filename}`;
//     res.status(200).json({imageUrl});
// });

// export default router;

import express from 'express';
import dotenv from 'dotenv';
import {v2 as cloudinary} from 'cloudinary';

const router = express.Router();   

dotenv.config(); // Load environment variables

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post('/', async (req,res)=>{
    try {
        const {image} = req.body;
        if(!image) return res.status(400).json({message: 'No image provided'});

        const result = await cloudinary.uploader.upload(image,{folder: 'MERN_Estate_CoverImgs'});
        res.status(200).json({imageUrl: result.secure_url});
    } 
    catch (error) {
        return res.status(500).json({message: 'Image upload failed due to internal server error'});  
    }
})

export default router;


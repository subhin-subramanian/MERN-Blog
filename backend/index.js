import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import uploadRoutes from './routes/upload.js'
import postRouter from "./routes/post.routes.js";
import commentRouter from "./routes/comment.route.js";

dotenv.config(); // Load environment variables

const app = express();

//setup for __dirname and __filename
// This is necessary because __dirname and __filename are not available in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serving frontend static files
// This assumes your frontend build files are in a 'dist' folder inside 'frontend'
const __rendirname = path.resolve();

// Middleware setup
app.use(express.json({limit:'10mb'})); // So that it can support large base64 images
app.use(cookieParser());
app.use(cors());

// Api endpoints
app.use('/api/user',userRouter);
app.use('/api/upload', uploadRoutes);
app.use('/api/post',postRouter);
app.use('/api/comment',commentRouter);

// Frontend static rendering
// app.use(express.static(path.join(__rendirname,'/frontend/dist')));
// app.get('/*name',(req,res)=>{
//     res.sendFile(path.join(__rendirname,'frontend','dist','index.html'));
// });

// Connecting to mongodb database
mongoose.connect(process.env.MONGO)
.then(()=>{console.log('Database connected');})
.catch((error)=>{console.log(error);})

// Server port settings
app.listen(3000,()=>{
    console.log('server running on port 3000');
})


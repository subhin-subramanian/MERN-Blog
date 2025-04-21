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

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

dotenv.config();

// port settings
app.listen(3000,()=>{
    console.log('server running on port 3000');
})

// Connecting to mongodb database
mongoose.connect(process.env.MONGO)
.then(()=>{console.log('Database connected');})
.catch((error)=>{console.log(error);})

// Api endpoints
app.use('/api/user',userRouter);
app.use('/api/upload', uploadRoutes);
app.use('/api/post',postRouter);
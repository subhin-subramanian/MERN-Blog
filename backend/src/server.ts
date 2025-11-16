  import express from "express";
  import type { Application, Request, Response } from "express"; 
  import mongoose from "mongoose";
  import dotenv from 'dotenv'
  import userRouter from "./routes/user.routes.js"
  import cookieParser from "cookie-parser";
  import cors from 'cors';
  import path from 'path';
  import { fileURLToPath } from 'url';
  import { dirname } from 'path';
  import uploadRoutes from './routes/upload.js'
  import postRouter from "./routes/post.routes.js";
  import commentRouter from "./routes/comment.route.js";

  const app: Application = express();

  //setup for __dirname and __filename
  // This is necessary because __dirname and __filename are not available in ES modules
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  dotenv.config({ path: path.resolve(__dirname, "../.env") }); // Load environment variables


  // Serving frontend static files
  // This assumes your frontend build files are in a 'dist' folder inside 'frontend'
  // const __rendirname = path.resolve();

  // Middleware setup
  app.use(express.json({limit:'10mb'})); // So that it can support large base64 images
  app.use(cookieParser());
  app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
  }));

  // Api endpoints
  app.use('/api/user',userRouter);
  app.use('/api/upload', uploadRoutes);
  app.use('/api/post',postRouter);
  app.use('/api/comment',commentRouter);

  // absolute path to project root
  // const rootDir = path.resolve(__dirname, "..", "..");

  // frontend/dist inside project root
  // const frontendPath = path.join(rootDir, "frontend", "dist");

  // app.use(express.static(frontendPath));

  // app.get("/*name", (_req: Request, res: Response) => {
  //   res.sendFile(path.join(frontendPath, "index.html"));
  // });

  // Connecting to mongodb database
  const mongoURL = process.env.MONGO ?? "";
  mongoose.connect(mongoURL)
  .then(()=>{console.log('Database connected');})
  .catch((error)=>{console.log(error);})

  // Server port settings
  const PORT = process.env.PORT || 3000;
  app.listen(PORT,()=>{
      console.log(`server running on port ${PORT}`);
  })


import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import userRouter from "./routes/user.routes.js";

const app = express();

app.use(express.json());

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
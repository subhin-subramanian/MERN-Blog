import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'

const app = express();

dotenv.config();

app.listen(3000,()=>{
    console.log('server running on port 3000');
})

mongoose.connect(process.env.MONGO)
.then(()=>{console.log('Database connected');})
.catch((error)=>{console.log(error);})
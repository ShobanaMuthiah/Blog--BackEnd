import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from "./Database/Config.js";
import authRouter from "./Routers/auth.routers.js";

dotenv.config();
const app=express();
app.use(cors({
    origin:"*",
    credentials:true,
}));
app.use(express.json());

//error handler
app.use((err,req,res,next)=>{
const statusCode= err.statusCode || 500
const message= err.message||"Internal Server Error";
res.status(statusCode).json({
    success:false,
    statusCode,
    message    
})
})





connectDB();
app.get("/",(req,res)=>{
    res.send("Welcom to the api")
})

app.use("/api",authRouter)

app.listen(process.env.PORT,()=>{
    console.log("server is running on port")
})
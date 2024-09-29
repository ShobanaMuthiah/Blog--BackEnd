import bcryptjs from "bcryptjs/dist/bcrypt.js";
import User from "../Models/user.model.js";
import { errorHandler } from "../Utils/Error.js";
import jwt from "jsonwebtoken";

export const registerUser=async(req,res,next)=>{
    const {username,email,password}=req.body;
    if(!username||!email ||!password||username===""||email===''||password===''){
return next(errorHandler(400,"All the fields are required"))

    }
    const hashPassword=bcryptjs.hashSync(password,10);
    const newUser= new User({username,email,password:hashPassword});
    try {
        await newUser.save();
        res.status(200).json({message:"user registered successfully", result:newUser})
        
    } catch (error) {
       next(error) 
    }
}

export const loginUser=async(req,res,next)=>{
    const {email,password}=req.body;
    if(!email || !password || email==='' || password===""){
        return next(errorHandler(400, "All the fields are required"))
    }
    try{
        const userData=await User.findOne({email});
        const userPassword=bcryptjs.compareSync(password,userData.password);
        if(!userData || !userPassword){
            return next(errorHandler(400,"Invalid Credentials"))
        }
        const token= jwt.sign({id:userData._id},process.env.JWT_SECRET_KEY);
        const {password:passkey,...rest}=userData._doc;
        res.status(200).cookie("access_Token",token,{
            httpOnly:true,

        }).json({message:"user login successfully",data:rest})

    }
    catch(error){
        next(error)
    }


}

export const google=async(req,res,next)=>{
    const {email,name,profile}=req.body;
   try{

    const user= await User.findOne({email});
    if(user){
        const token= jwt.sign({id:user._id},process.env.JWT_SECRET_KEY);
        const {password:passkey,...rest}=user._doc;
        res.status(200).cookie("access_Token",token,{
            httpOnly:true,

        }).json({message:"user login successfully",rest})


    }
else{

    const generatePassword=Math.random().toString(36).slice(-8)+Math.random().toString(36).slice(-8)
    const hashedPassword= bcryptjs.hashSync(generatePassword,10);
    const newUser= new User({
    username:
    name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
    email,
    password:hashedPassword,
    profile:profile

 
    })
    await newUser.save();
    const token= jwt.sign({id:newUser._id},process.env.JWT_SECRET_KEY);
    const {password:passkey,...rest}=newUser._doc;
    res.status(200).cookie("access_Token",token,{
        httpOnly:true,

    }).json({message:"user login successfully",rest})



}



   } 
   catch(error){
    next(error)
   }
}
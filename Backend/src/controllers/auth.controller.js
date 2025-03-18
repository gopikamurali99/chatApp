import bcrypt from "bcryptjs"
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req,res)=>{
    const {fullname,email,password} = req.body;
    try {
        //hash password
        if(!fullname||!password||!email){
            return res.status(400).json({message:"all feilds are required"})
        }

        if(password.length<8){
            return res.status(400).json({message:"password must be atleast 8 characters "})
        }

        const user = await User.findOne({email})
        if(user) return res.status(400).json({message:"email already exists"});

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
       
        const newUser = new User({
            fullname:fullname,
            email:email,
            password:hashedPassword
        })
        if(newUser){
           //generate jwt token here

           generateToken(newUser._id,res)
           await newUser.save();
           res.status(201).json({
            _id:newUser._id,
            emal:newUser.email,
            fullname:newUser.fullname,
            profilePic:newUser.profilePic,

           })
        }
        else{
            res.status(400).json({message:"Invalid user data"})
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({message:"Internal server Error"})
    }
}
export const login = async (req,res)=>{
    const {email,password} = req.body;
   try {
       const user = await User.findOne({email})
       if(!user){
        return  res.status(400).json({message:"Invalid credentials"})
       } 
      const isPasswordCorrect = await bcrypt.compare(password,user.password)
      if(!isPasswordCorrect){
        return  res.status(400).json({message:"Invalid credentials"})
       } 
       generateToken(user._id,res)
       res.status(200).json({
        _id:user._id,
        fullname:user.fullname,
        email:user.email,
        profilePic:user.profilePic
       })
   } catch (error) {
    console.log(("Error in login controller",error.message));
    res.status(500).json({message:"Internal server Error"})
   }
}
export const logout = (req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logged out successfully"})
    } catch (error) {
        console.log("Error in logout controller",error.message)
    }
}

export const updateProfile = async(req,res)=>{
    try {
        const {profilePic} = req.body;
       const userId =  req.user._id;

       if(!profilePic){
        return res.status(400).json({message:"Profile picture is required"});
       }
       const uploadResponse = await cloudinary.uploader.upload(profilePic)
       const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})
       res.status(200).json(updatedUser);
    } catch (error) {
        console.log("error in update profile",error);
        res.status(500).json({message:"Internal server error"})
    }
}

export const checkAuth = (req,res) =>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in chckAuth controller",error.message);
        res.status(500).json({message:"Internal Server error"});
    }
}

import jwt from "jsonwebtoken"
import cookie from "cookie-parser"
export const generateToken=(userId , res)=>{
    const token = jwt.sign({userId},process.env.JWT,{
        expiresIn:"7d"
    })

    res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000, //ms
        httpOnly:true, 
        sameSite:"strict",
        secure:process.env.NODE_ENV !=="development"
    })

   return token
}
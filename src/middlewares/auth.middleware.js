import { ApiError } from "../utils/ApiErro.js";
import { asyncHandler } from "../utils/asynHandler.js";
import  Jwt  from "jsonwebtoken";
import { User } from "../models/User.model.js";

export const verifyJWT = asyncHandler(async (req,_,next)=>{

  try {
    const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer","")
 
    if (!token) {
      throw new ApiError(401,"Unothorized request not found the token")
    }
   const decodedToken= Jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
   const user =await User.findById(decodedToken?._id).select("-password -refreshToken")
  
   if (!user) {
      
      throw new ApiError(401,"Invalid accessToken")
   }
  
   req.user = user
   next()
  } catch (error) {
    throw new ApiError(401,error?.message || "invalid and error in auth middleware")
  }

})
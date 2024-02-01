import { asyncHandler } from "../utils/asynHandler.js";
import { ApiError } from "../utils/ApiErro.js";
import { User } from "../models/User.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { apiResponse } from "../utils/response.js";
import  Jwt  from "jsonwebtoken";

const generateAccessAndRefreshToken= async (userId)=>{
try {

	const user = await User.findById(userId)
	const accessToken =user.generateAccessToken()
	const refreshToken = user.generateRefreshToken()
	user.refreshToken = refreshToken
	user.save({validateBeforeSave:false})

	return {accessToken,refreshToken}
	
} catch (error) {
	throw new ApiError(500,"there is an error for creating the access and refresh token")
}
}

const registrationUser = asyncHandler(async (req, res) => {
	// get the details from front-end
	// put the validation on data it not empty
	// check the user already loged in or not through username or email
	// check the avtar is available or not
	// upload the avtar on cloudinary
	// create the user object and create entry in db
	// remove the encrepted pasword and refresh token field from response
	// check for user creation
	// return res
	const { fullname, email, username, password } = req.body;

	// this is the first method to validate these fields
	// if (fullname === "" && email === "" && username === "" && pasword === "") {
	// 	throw new ApiError(400, "All fields are required");
	// }

	// here are the another mehtod to validate these fields
	if (
		[fullname, email, username, password].some((files) => files?.trim() === "")
	) {
		throw new ApiError(400, "all fields are required");
	}

	const alreadyExist = await User.findOne({
		$or: [{ email }, { username }],
	});

	if (alreadyExist) {
		throw new ApiError(409, "this user is already exist");
	}

	const avatarLocalPath = req.files?.avatar[0]?.path;
	let  coverImageLocalPath;
	if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
	coverImageLocalPath= req.files.coverImage[0].path;
	}
	 
	if (!avatarLocalPath) {
		throw new ApiError(400, "avtar is required ");
	} 
	

	const avatar = await uploadOnCloudinary(avatarLocalPath);
	const coverImage = await uploadOnCloudinary(coverImageLocalPath);

	if (!avatar) {
		throw new ApiError(400, "avtar is not uploaded on cloudinary");
	}

	const user = await User.create({
		fullname,
		avatar: avatar.url ,
		coverImage: coverImage?.url || "",
		username: username.toLowerCase(),
		password,
		email,
	});

	const userCreate = await User.findById(user._id).select(
		"-password -refreshToken"
	);

	if (!userCreate) {
		throw new ApiError(500, "the user is not sent in db");
	}
	return res.status(201).json(new apiResponse(200, "user created", userCreate));
}); 


const loginUser = asyncHandler(async (req,res)=>{
	// req-body -> body
	// username or email
	// find user 
	// check the passowrd
	// access and refresh token 
	// send cookies

	const {email,username,password} = req.body
	
		if (!username && !email) {
			
		
		throw new ApiError(400,"username or password is required")
	}
	
	const user = await User.findOne({
		$or:[{email},{username}]
	})

	if (!user) {
		throw new ApiError(404,"the usere is not registerd plz signup firs ")
	}

	const checkPassword= await user.isPaswordCorrect(password);

	if (!checkPassword) {
		throw new ApiError(401,"the user password is wrong")
	}

	const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)

	const logInUser= await User.findById(user._id)
	.select("-password -refreshToken")
	const options ={
		httpOnly: true,
		secure:true
	}
	return res
	.status(200)
	.cookie("accessToken",accessToken,options)
	.cookie("refreshToken",refreshToken,options)
	.json(
		new apiResponse(200,{
			user:logInUser,accessToken,refreshToken
		},
		"usere loggedin successfully")
	)
})

const logedOutUser = asyncHandler(async (req,res)=>{
	await User.findByIdAndUpdate(req.user._id,
		{$set:{refreshToken:undefined}},
		{new:true},
		)
		const options ={
			httpOnly: true,
			secure:true
		}
		return res
		.clearCookie("accessToken",options)
		.clearCookie("refreshToken",options)
		.json(new apiResponse(200,{},"now user logged out successfully"))
})

const refreshAccessToken= asyncHandler( async(req,res)=>{
const incommingRefreshToken=req.cookies.refreshToken || req.body.refreshToken

if (!incommingRefreshToken) {
	throw new ApiError(401,"Unothorized request")
}

try {
	const decodedToken =Jwt.verify(incommingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
	
	  const user=await User.findById(decodedToken?._id)
	  if (!user) {
		throw new ApiError(401,"Unothorized request not have a RefreshTOken")
	  }
	
	  if (!incommingRefreshToken !== user?.refreshToken) {
		throw new ApiError(401,"your RefreshTOken is expired")
	  }
	
	  const options = {
		httpOnly:true,
		secure:true
	  }
	
	 const {accessToken,newRefreshToken}=await generateAccessAndRefreshToken(user._id)
	 .status(200)
	 .cookie("accessToken",accessToken,options)
	 .cookie("refreshToken",newRefreshToken,options)
	 .json(
		new apiResponse(200,{accessToken,newRefreshToken},
			"new Access and refresh token generated successfully ")
	 )
} catch (error) {
	throw new ApiError(401,error?.message || "Refresh token in invalid in tryCatch")
}
})

export { registrationUser,loginUser,logedOutUser ,refreshAccessToken};

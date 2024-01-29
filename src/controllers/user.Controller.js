import { asyncHandler } from "../utils/asynHandler.js";
import { ApiError } from "../utils/ApiErro.js";
import { User } from "../models/User.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { apiResponse } from "../utils/response.js";
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

export { registrationUser };

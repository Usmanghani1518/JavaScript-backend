import mongoose, { Schema } from "mongoose";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchcema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			index: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		fullname: {
			type: String,
			required: true,
			trim: true,
			index: true,
		},
		avatar: {
			type: String, // cloudinary url
			required: true,
		},
		coverimage: {
			type: String, // cloudinary url
		},
		watchHistory: [
			{
				type: Schema.Types.ObjectId,
				ref: "Video",
			},
		],
		password: {
			type: String,
			required: [true, "password is required"],
		},
		refreshToken: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

userSchcema.pre("save", async function(next){
  if(!this.isModified("password")) return next()
     this.password = bcrypt.hash(this.password,10)
    next()

})

userSchcema.methods.isPaswordCorrect = async function (password){
	return await bcrypt.compare(password,this.password)
}

export const User = mongoose.model("User", userSchcema);

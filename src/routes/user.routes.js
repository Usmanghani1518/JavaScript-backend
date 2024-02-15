import { Router } from "express";
import {
	registrationUser,
	loginUser,
	logedOutUser,
	refreshAccessToken,
	changeCurrentPassowrd,
	getCurrentUser,
	updateUserAvatar,
	updateUserDetails,
	updateUserCoverImage,
	getUserChannelProfile,
	getUserWatchHistory,
} from "../controllers/user.Controller.js";
import { upload } from "../middlewares/Multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(
	upload.fields([
		{
			name: "avatar",
			maxCount: 1,
		},
		{
			name: "coverImage",
			maxCount: 1,
		},
	]),
	registrationUser
);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logedOutUser);
router.route("/refresh-accessToken").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassowrd);
router.route("/current-user").post(verifyJWT, getCurrentUser);
router.route("/update-account").patch(verifyJWT, updateUserDetails);
router
	.route("/avatar")
	.patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
	.route("/cover-image")
	.patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);
router.route("/c/:username").get(verifyJWT, getUserChannelProfile);
router.route("/history").get(verifyJWT, getUserWatchHistory);
export default router;

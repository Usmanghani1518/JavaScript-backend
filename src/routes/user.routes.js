import { Router } from "express";
import { registrationUser,loginUser, logedOutUser, refreshAccessToken } from "../controllers/user.Controller.js";
import { upload } from "../middlewares/Multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(
    upload.fields([
     {
        name:"avatar",
        maxCount:1
     },
     {
        name:"coverImage",
        maxCount:1
     }
    ]),
    registrationUser)

router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logedOutUser)
router.route("/refresh-accessToken").post(refreshAccessToken)
export default router
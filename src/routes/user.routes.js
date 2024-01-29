import { Router } from "express";
import { registrationUser } from "../controllers/user.Controller.js";
import { upload } from "../middlewares/Multer.middleware.js";
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


export default router
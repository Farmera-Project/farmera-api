import express from "express";
import { registerUser, loginUser, userLogout, updateProfile, getUserProfile } from "../controller/userController.js";
import { checkBlackList, isAuthenticated,  } from "../middlewares/authMiddleware.js";
import { userImageUpload } from "../middlewares/upload.js";


const userRouter = express.Router();

// User routes
userRouter.post("/users/register", registerUser);

userRouter.post("/users/login", loginUser);

userRouter.post("/users/logout", isAuthenticated, userLogout);

userRouter.get("/users/profile", isAuthenticated, checkBlackList, getUserProfile);

userRouter.patch("/users/profile", isAuthenticated, checkBlackList, userImageUpload.single('image'), updateProfile);


export default userRouter;


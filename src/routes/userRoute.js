import express from "express";
import { registerUser, loginUser, userLogout, updateProfile, getUserProfile } from "../controller/userController.js";
import { checkBlackList, isAuthenticated,  } from "../middlewares/authMiddleware.js";


const userRouter = express.Router();

// User routes
userRouter.post("/users/register", registerUser);

userRouter.post("/users/login", loginUser);

userRouter.post("/users/logout", isAuthenticated, userLogout);

userRouter.get("/users/profile", isAuthenticated, checkBlackList, getUserProfile);

userRouter.patch("/users/profile", isAuthenticated, checkBlackList, updateProfile);


export default userRouter;


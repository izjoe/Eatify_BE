import express from "express";
import { loginUser, registerUser, getProfile, updateProfile } from "../controllers/userController.js";
import auth from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// protected profile routes
userRouter.get("/profile", auth, getProfile);
userRouter.put("/profile", auth, updateProfile);

export default userRouter;

import express from "express"
import { registerUser, loginUser, userCredits } from "../controllers/userController.js";
import userAuth from "../middlewares/auth.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);  
router.post("/login", loginUser);

// Protected routes
router.get("/credits", userAuth, userCredits);  

export default router;
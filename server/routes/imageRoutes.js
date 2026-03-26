import express from "express";
import { generateImage } from "../controllers/imageController.js"; // Changed import
import userAuth from "../middlewares/auth.js";

const router = express.Router();

router.post("/generate-image", userAuth, generateImage);

export default router;
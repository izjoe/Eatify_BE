import express from "express";
import { canRateFood } from "../middleware/rateFoodMiddleware.js";
import auth from "../middleware/auth.js";
import { rateFood } from "../controllers/ratingController.js";

const router = express.Router();

// Only authenticated users who are allowed to rate can proceed
router.post("/rate", auth, canRateFood, rateFood);

export default router;

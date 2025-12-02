import express from "express";
import { canRateFood } from "../middleware/rateFoodMiddleware.js";
import auth from "../middleware/auth.js";
import { rateFood } from "../controllers/ratingController.js";

const router = express.Router();

/**
 * @swagger
 * /api/rating/rate:
 *   post:
 *     tags:
 *       - Rating
 *     summary: Rate a food item
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               foodId:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               review:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rating submitted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: User not eligible to rate this item
 */
router.post("/rate", auth, canRateFood, rateFood);

export default router;

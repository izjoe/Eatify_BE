// routes/ratingRoute.js
import express from "express";
import auth from "../middleware/authMiddleware.js";
import { canRateFood } from "../middleware/rateFoodMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import { ratingSchema } from "../validations/ratingValidation.js";
import { rateFood } from "../controllers/ratingController.js";

const ratingRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Rating
 *     description: Food rating APIs
 */

/**
 * @swagger
 * /api/rating/rate:
 *   post:
 *     summary: Rate a food item
 *     description: Users can only rate food items they have purchased in completed orders.
 *     tags: [Rating]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - foodID
 *               - rating
 *             properties:
 *               foodID:
 *                 type: string
 *                 example: F1234567890_abc123
 *                 description: Food ID to rate
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *                 description: Rating value (1-5 stars)
 *               comment:
 *                 type: string
 *                 example: "Very delicious! The best pizza I've ever had."
 *                 description: Optional comment about the food
 *     responses:
 *       200:
 *         description: Rating submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Rating submitted successfully.
 *                 ratingID:
 *                   type: string
 *                   example: R1234567890_xyz456
 *       403:
 *         description: Cannot rate - food not purchased or order not completed
 */
ratingRouter.post(
  "/rate",
  auth,
  validate(ratingSchema),
  canRateFood,
  rateFood
);

export default ratingRouter;

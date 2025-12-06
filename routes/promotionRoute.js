// routes/promotionRoute.js
import express from "express";
import auth from "../middleware/authMiddleware.js";
import { requireSeller } from "../middleware/accessControlMiddleware.js";
import {
  createPromotion,
  getSellerPromotions,
  updatePromotion,
  deletePromotion,
  validatePromotionCode,
  applyPromotion
} from "../controllers/promotionController.js";

const promotionRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Promotion
 *     description: Promotion and discount management APIs
 */

/**
 * @swagger
 * /api/promotion/create:
 *   post:
 *     summary: Create a new promotion (Seller only)
 *     tags: [Promotion]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - promotionTitle
 *               - discountCode
 *               - discountType
 *               - discountValue
 *               - expiryDate
 *             properties:
 *               promotionTitle:
 *                 type: string
 *               discountCode:
 *                 type: string
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *               discountValue:
 *                 type: number
 *               minOrderAmount:
 *                 type: number
 *               maxUsage:
 *                 type: number
 *               expiryDate:
 *                 type: string
 *                 format: date-time
 *               description:
 *                 type: string
 *               maxDiscountAmount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Promotion created successfully
 */
promotionRouter.post("/create", auth, requireSeller, createPromotion);

/**
 * @swagger
 * /api/promotion/seller:
 *   get:
 *     summary: Get all promotions for seller (Seller only)
 *     tags: [Promotion]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Seller promotions fetched successfully
 */
promotionRouter.get("/seller", auth, requireSeller, getSellerPromotions);

/**
 * @swagger
 * /api/promotion/update/{promotionID}:
 *   put:
 *     summary: Update a promotion (Seller only)
 *     tags: [Promotion]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: promotionID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Promotion updated successfully
 */
promotionRouter.put("/update/:promotionID", auth, requireSeller, updatePromotion);

/**
 * @swagger
 * /api/promotion/delete/{promotionID}:
 *   delete:
 *     summary: Delete a promotion (Seller only)
 *     tags: [Promotion]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: promotionID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Promotion deleted successfully
 */
promotionRouter.delete("/delete/:promotionID", auth, requireSeller, deletePromotion);

/**
 * @swagger
 * /api/promotion/validate-code:
 *   post:
 *     summary: Validate a promotion code
 *     tags: [Promotion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               orderAmount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Promotion code validation result
 */
promotionRouter.post("/validate-code", validatePromotionCode);

/**
 * @swagger
 * /api/promotion/apply:
 *   post:
 *     summary: Apply promotion and get discount details
 *     tags: [Promotion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *               orderAmount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Discount calculated
 */
promotionRouter.post("/apply", applyPromotion);

export default promotionRouter;

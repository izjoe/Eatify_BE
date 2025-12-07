// routes/sellerRoute.js
import express from "express";
import auth from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import { updateSellerSchema } from "../validations/sellerValidation.js";
import { requireSeller } from "../middleware/accessControlMiddleware.js";
import {
  getSellerDetail,
  listSellers,
  updateSellerInfo
} from "../controllers/sellerController.js";
import { getRestaurantFoods } from "../controllers/foodController.js";

const sellerRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Seller
 *     description: Seller information APIs
 */

/**
 * @swagger
 * /api/seller:
 *   get:
 *     summary: Get list of all sellers
 *     tags: [Seller]
 *     responses:
 *       200:
 *         description: Sellers list fetched successfully
 */
sellerRouter.get("/", listSellers);

/**
 * @swagger
 * /api/seller/{sellerID}:
 *   get:
 *     summary: Get seller details by ID
 *     tags: [Seller]
 *     parameters:
 *       - in: path
 *         name: sellerID
 *         required: true
 *         schema:
 *           type: string
 *         description: The seller ID
 *     responses:
 *       200:
 *         description: Seller details fetched successfully
 */
sellerRouter.get("/:sellerID", getSellerDetail);

/**
 * @swagger
 * /api/seller/{restaurantId}/foods:
 *   get:
 *     summary: Get all foods belonging to a restaurant
 *     tags: [Seller]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema:
 *           type: string
 *         description: Restaurant/Seller ID
 *     responses:
 *       200:
 *         description: Restaurant foods fetched successfully
 *       404:
 *         description: Restaurant not found
 */
sellerRouter.get("/:restaurantId/foods", getRestaurantFoods);

/**
 * @swagger
 * /api/seller/update:
 *   put:
 *     summary: Seller updates their store information (Seller/Admin only)
 *     description: Seller can only update their own store. All fields are optional.
 *     tags: [Seller]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               storeName:
 *                 type: string
 *                 example: "Pizza House"
 *                 description: Store name
 *               storeDescription:
 *                 type: string
 *                 example: "Best pizza in town with authentic Italian recipes"
 *                 description: Store description
 *               storeAddress:
 *                 type: string
 *                 example: "123 Nguyen Hue Street, District 1, HCMC"
 *                 description: Store physical address
 *               storeImage:
 *                 type: string
 *                 example: "store_logo.jpg"
 *                 description: Store logo/image filename
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Pizza", "Pasta", "Italian Food"]
 *                 description: Food categories offered by store
 *               openTime:
 *                 type: string
 *                 pattern: "^([01]\\d|2[0-3]):([0-5]\\d)$"
 *                 example: "08:00"
 *                 description: Store opening time in hh:mm format (24-hour)
 *               closeTime:
 *                 type: string
 *                 pattern: "^([01]\\d|2[0-3]):([0-5]\\d)$"
 *                 example: "22:00"
 *                 description: Store closing time in hh:mm format (24-hour)
 *               isActive:
 *                 type: boolean
 *                 example: true
 *                 description: Whether store is currently active/open for orders
 *     responses:
 *       200:
 *         description: Store info updated successfully
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
 *                   example: Seller info updated successfully.
 *       403:
 *         description: Access denied - Seller privileges required
 */
sellerRouter.put(
  "/update",
  auth,
  requireSeller,
  validate(updateSellerSchema),
  updateSellerInfo
);

export default sellerRouter;

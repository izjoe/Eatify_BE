// routes/sellerRoute.js
import express from "express";
import auth from "../middleware/auth.js";
import {
  getSellerDetail,
  listSellers,
  updateSellerInfo
} from "../controllers/sellerController.js";

const sellerRouter = express.Router();

/**
 * @swagger
 * /api/seller/{sellerID}:
 *   get:
 *     tags:
 *       - Seller
 *     summary: Get seller details with foods and ratings
 *     parameters:
 *       - in: path
 *         name: sellerID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Seller details retrieved
 *       404:
 *         description: Seller not found
 */
sellerRouter.get("/:sellerID", getSellerDetail);

/**
 * @swagger
 * /api/seller:
 *   get:
 *     tags:
 *       - Seller
 *     summary: List all sellers
 *     responses:
 *       200:
 *         description: List of all sellers
 */
sellerRouter.get("/", listSellers);

/**
 * @swagger
 * /api/seller/update:
 *   put:
 *     tags:
 *       - Seller
 *     summary: Update seller information
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               storeName:
 *                 type: string
 *               description:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Seller info updated
 *       401:
 *         description: Not authenticated
 */
sellerRouter.put("/update", auth, updateSellerInfo);

export default sellerRouter;

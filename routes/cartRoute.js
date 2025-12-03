import express from "express";
import {
  addToCart,
  removeFromCart,
  getCart,
} from "../controllers/cartController.js";
import authMiddleware from "../middleware/auth.js";

const cartRouter = express.Router();

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     tags:
 *       - Cart
 *     summary: Add item to cart
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item added to cart
 *       401:
 *         description: Not authenticated
 */
cartRouter.post("/add", authMiddleware, addToCart);

/**
 * @swagger
 * /api/cart/remove:
 *   post:
 *     tags:
 *       - Cart
 *     summary: Remove item from cart
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       401:
 *         description: Not authenticated
 */
cartRouter.post("/remove", authMiddleware, removeFromCart);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     tags:
 *       - Cart
 *     summary: Get cart data
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Cart data retrieved
 *       401:
 *         description: Not authenticated
 */

// Get user's cart
cartRouter.get("/", authMiddleware, getCart);

export default cartRouter;

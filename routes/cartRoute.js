// routes/cartRoute.js
import express from "express";
import { validate } from "../middleware/validateMiddleware.js";
import { updateCartSchema } from "../validations/cartValidation.js";
import auth from "../middleware/authMiddleware.js";
import { addToCart, removeFromCart, getCart } from "../controllers/cartController.js";

const cartRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Cart
 *     description: Shopping cart APIs
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart fetched successfully
 */
cartRouter.get("/", auth, getCart);

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
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
 *               - quantity
 *             properties:
 *               foodID:
 *                 type: string
 *                 example: F1234567890
 *               quantity:
 *                 type: number
 *                 example: 2
 *     responses:
 *       200:
 *         description: Item added to cart
 */
cartRouter.post("/add", auth, validate(updateCartSchema), addToCart);

/**
 * @swagger
 * /api/cart/remove:
 *   post:
 *     summary: Remove item from cart
 *     tags: [Cart]
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
 *             properties:
 *               foodID:
 *                 type: string
 *                 example: F1234567890
 *     responses:
 *       200:
 *         description: Item removed from cart
 */
cartRouter.post("/remove", auth, validate(updateCartSchema), removeFromCart);

export default cartRouter;

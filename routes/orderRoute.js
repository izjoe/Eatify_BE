import express from "express";
import authMiddleware from "../middleware/auth.js";
import { validateOrderStatus } from "../middleware/validateOrderStatusMiddleware.js";

import {
  checkoutOrder,
  verifyOrder,
  updateStatus,
  userOrders,
  listOrders,
  getOrderDetail
} from "../controllers/orderController.js";

const orderRouter = express.Router();

/**
 * @swagger
 * /api/order/place:
 *   post:
 *     tags:
 *       - Order
 *     summary: Place a new order
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: object
 *               items:
 *                 type: array
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Order created, returns payment session URL
 *       401:
 *         description: Not authenticated
 */
orderRouter.post("/place", authMiddleware, checkoutOrder);

/**
 * @swagger
 * /api/order/verify:
 *   post:
 *     tags:
 *       - Order
 *     summary: Verify payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *               orderId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment verified
 */
orderRouter.post("/verify", verifyOrder);

/**
 * @swagger
 * /api/order/status:
 *   post:
 *     tags:
 *       - Order
 *     summary: Update order status
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated
 */
orderRouter.post("/status", authMiddleware, validateOrderStatus, updateStatus);

/**
 * @swagger
 * /api/order/userorders:
 *   post:
 *     tags:
 *       - Order
 *     summary: Get user's orders
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of user orders
 *       401:
 *         description: Not authenticated
 */
orderRouter.post("/userorders", authMiddleware, userOrders);

/**
 * @swagger
 * /api/order/list:
 *   get:
 *     tags:
 *       - Order
 *     summary: Get all orders (Admin/Seller)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *       401:
 *         description: Not authenticated
 */
orderRouter.get("/list", authMiddleware, listOrders);

/**
 * @swagger
 * /api/order/detail/{orderID}:
 *   get:
 *     tags:
 *       - Order
 *     summary: Get order details
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 */
orderRouter.get("/detail/:orderID", authMiddleware, getOrderDetail);

export default orderRouter;

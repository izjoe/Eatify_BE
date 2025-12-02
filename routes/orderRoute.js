// routes/orderRoute.js
import express from "express";
import auth from "../middleware/authMiddleware.js";
import { cartNotEmpty } from "../middleware/cartNotEmptyMiddleware.js";
import { validateOrderStatus } from "../middleware/validateOrderStatusMiddleware.js";
import { validate } from "../middleware/validateMiddleware.js";
import {
  createOrderSchema,
  updateOrderStatusSchema
} from "../validations/orderValidation.js";
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
 * tags:
 *   - name: Order
 *     description: Order management APIs
 */

/**
 * @swagger
 * /api/order/checkout:
 *   post:
 *     summary: Checkout order from cart
 *     description: Creates order from cart items. User's address and phone number must be set in profile before checkout.
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               note:
 *                 type: string
 *                 example: "Please deliver before 6 PM"
 *                 description: Optional note for the order
 *     responses:
 *       200:
 *         description: Order placed successfully
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
 *                   example: Order placed successfully.
 *                 orderID:
 *                   type: string
 *                   example: O1234567890
 *                 totalPrice:
 *                   type: number
 *                   example: 258000
 *       400:
 *         description: Cart is empty or profile incomplete
 */
orderRouter.post(
  "/checkout",
  auth,
  cartNotEmpty,
  validate(createOrderSchema),
  checkoutOrder
);

/**
 * @swagger
 * /api/order/verify:
 *   post:
 *     summary: Verify payment (Admin only)
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderID
 *               - status
 *             properties:
 *               orderID:
 *                 type: string
 *                 example: O1234567890
 *                 description: Order ID to verify
 *               status:
 *                 type: string
 *                 enum: [success, failed]
 *                 example: success
 *                 description: Payment status
 *     responses:
 *       200:
 *         description: Payment verified successfully
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
 *                   example: Payment verified successfully.
 *       403:
 *         description: Access denied - Admin only
 */
orderRouter.post("/verify", auth, verifyOrder);

/**
 * @swagger
 * /api/order/status:
 *   post:
 *     summary: Update order status
 *     description: Users can only cancel their own orders. Sellers/Admins can update to any status.
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderID
 *               - newStatus
 *             properties:
 *               orderID:
 *                 type: string
 *                 example: O1234567890
 *                 description: Order ID to update
 *               newStatus:
 *                 type: string
 *                 enum: [pending, preparing, shipping, completed, canceled]
 *                 example: preparing
 *                 description: New status for the order
 *     responses:
 *       200:
 *         description: Order status updated successfully
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
 *                   example: Order status updated.
 *       403:
 *         description: Access denied - not your order or insufficient privileges
 */
orderRouter.post(
  "/status",
  auth,
  validate(updateOrderStatusSchema),
  validateOrderStatus,
  updateStatus
);

/**
 * @swagger
 * /api/order/my:
 *   get:
 *     summary: Get user's orders
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User orders fetched
 */
orderRouter.get("/my", auth, userOrders);

/**
 * @swagger
 * /api/order/list:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All orders fetched
 */
orderRouter.get("/list", auth, listOrders);

/**
 * @swagger
 * /api/order/detail/{orderID}:
 *   get:
 *     summary: Get order details
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details fetched
 *       403:
 *         description: Access denied - not your order
 */
orderRouter.get("/detail/:orderID", auth, getOrderDetail);

export default orderRouter;

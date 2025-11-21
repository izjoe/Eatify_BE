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

// Create order from cart
orderRouter.post("/checkout", authMiddleware, checkoutOrder);

// Payment verification (online payment)
orderRouter.post("/verify", verifyOrder);

// Update status with validation middleware
orderRouter.post("/status", authMiddleware, validateOrderStatus, updateStatus);

// Get user's orders
orderRouter.post("/userorders", authMiddleware, userOrders);

// Get full list (admin or seller)
orderRouter.get("/list", authMiddleware, listOrders);

// Get detail of a specific order
orderRouter.get("/detail/:orderID", authMiddleware, getOrderDetail);

export default orderRouter;

// routes/revenueRoute.js
import express from "express";
import auth from "../middleware/authMiddleware.js";
import { requireSeller } from "../middleware/accessControlMiddleware.js";
import {
  getDailyRevenue,
  getMonthlyRevenue,
  getRevenueByDateRange,
  getRevenueChart,
  getOrderSummary
} from "../controllers/revenueController.js";

const revenueRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Revenue
 *     description: Revenue and analytics APIs for sellers
 */

/**
 * @swagger
 * /api/revenue/daily:
 *   post:
 *     summary: Get today's revenue (Seller only)
 *     tags: [Revenue]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daily revenue fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalRevenue:
 *                       type: number
 *                     orderCount:
 *                       type: number
 *                     uniqueOrderCount:
 *                       type: number
 */
revenueRouter.post("/daily", auth, requireSeller, getDailyRevenue);

/**
 * @swagger
 * /api/revenue/monthly:
 *   post:
 *     summary: Get current month's revenue (Seller only)
 *     tags: [Revenue]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly revenue fetched successfully
 */
revenueRouter.post("/monthly", auth, requireSeller, getMonthlyRevenue);

/**
 * @swagger
 * /api/revenue/date-range:
 *   post:
 *     summary: Get revenue for a specific date range (Seller only)
 *     tags: [Revenue]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startDate
 *               - endDate
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-01-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-31"
 *     responses:
 *       200:
 *         description: Revenue by date range fetched successfully
 */
revenueRouter.post("/date-range", auth, requireSeller, getRevenueByDateRange);

/**
 * @swagger
 * /api/revenue/chart:
 *   post:
 *     summary: Get revenue chart data (Seller only)
 *     tags: [Revenue]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               days:
 *                 type: number
 *                 example: 30
 *                 description: Number of days to retrieve (default 30)
 *     responses:
 *       200:
 *         description: Revenue chart data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     chartData:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                           revenue:
 *                             type: number
 *                           orders:
 *                             type: number
 */
revenueRouter.post("/chart", auth, requireSeller, getRevenueChart);

/**
 * @swagger
 * /api/revenue/order-summary:
 *   post:
 *     summary: Get order summary by status (Seller only)
 *     tags: [Revenue]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order summary fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     pending:
 *                       type: number
 *                     preparing:
 *                       type: number
 *                     shipping:
 *                       type: number
 *                     completed:
 *                       type: number
 *                     canceled:
 *                       type: number
 */
revenueRouter.post("/order-summary", auth, requireSeller, getOrderSummary);

export default revenueRouter;

import express from "express";
import auth, { requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Admin-only APIs
 */

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Access admin dashboard
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin dashboard accessed
 */
router.get("/dashboard", auth, requireAdmin, (req, res) => {
  res.json({ msg: "Welcome Admin", user: req.user });
});

export default router;

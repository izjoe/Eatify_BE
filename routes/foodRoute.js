import express from "express";
import { addFood, listFood, removeFood, getFoodById, getRestaurantFoods } from "../controllers/foodController.js";
import { getFoodReviews, createFoodReview } from "../controllers/ratingController.js";
import multer from "multer";
import path from "path";
import auth from "../middleware/authMiddleware.js";
import { requireSeller } from "../middleware/accessControlMiddleware.js";

const foodRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Food
 *     description: Food management APIs
 */

// Image storage config với bảo mật
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    // Chỉ lấy extension, không dùng originalname để tránh path traversal
    const ext = path.extname(file.originalname);
    const safeFilename = `${Date.now()}_${Math.random().toString(36).substring(7)}${ext}`;
    return cb(null, safeFilename);
  }
});

// File filter để chỉ cho phép ảnh
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpg, png, webp) are allowed!"), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

/**
 * @swagger
 * /api/food/add:
 *   post:
 *     summary: Seller adds new food (Seller/Admin only)
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *               - foodName
 *               - price
 *               - category
 *               - description
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Food image (jpg, png, webp, max 5MB)
 *               foodName:
 *                 type: string
 *                 example: "Margherita Pizza"
 *                 description: Name of the food item
 *               description:
 *                 type: string
 *                 example: "Authentic Italian pizza with fresh tomatoes, mozzarella, and basil"
 *                 description: Detailed description of the food
 *               price:
 *                 type: number
 *                 example: 129000
 *                 description: Price in VND
 *               category:
 *                 type: string
 *                 example: "Italian Food"
 *                 description: Food category
 *               stock:
 *                 type: number
 *                 example: 50
 *                 description: Available stock quantity (default 0)
 *               isAvailable:
 *                 type: boolean
 *                 example: true
 *                 description: Whether food is currently available (default true)
 *     responses:
 *       200:
 *         description: Food added successfully
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
 *                   example: Food added successfully.
 *                 foodID:
 *                   type: string
 *                   example: F1234567890_abc123
 *       403:
 *         description: Access denied - Seller privileges required
 */
foodRouter.post("/add", auth, requireSeller, upload.single("image"), addFood);

/**
 * @swagger
 * /api/food/list:
 *   get:
 *     summary: Get food list with seller info and ratings
 *     tags: [Food]
 *     responses:
 *       200:
 *         description: Food list fetched successfully
 */
foodRouter.get("/list", listFood);

/**
 * @swagger
 * /api/food/{id}:
 *   get:
 *     summary: Get food details by ID with seller info and reviews
 *     tags: [Food]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Food ID (_id or foodID)
 *     responses:
 *       200:
 *         description: Food details fetched successfully
 *       404:
 *         description: Food not found
 */
foodRouter.get("/:id", getFoodById);

/**
 * @swagger
 * /api/food/{foodID}/reviews:
 *   get:
 *     summary: Get all reviews for a food item
 *     tags: [Food]
 *     parameters:
 *       - in: path
 *         name: foodID
 *         required: true
 *         schema:
 *           type: string
 *         description: Food ID
 *     responses:
 *       200:
 *         description: Reviews fetched successfully
 */
foodRouter.get("/:foodID/reviews", getFoodReviews);

/**
 * @swagger
 * /api/food/{foodID}/review:
 *   post:
 *     summary: Create a new review for a food item
 *     tags: [Food]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: foodID
 *         required: true
 *         schema:
 *           type: string
 *         description: Food ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Món ăn rất ngon!"
 *     responses:
 *       200:
 *         description: Review created successfully
 *       400:
 *         description: Already reviewed or invalid data
 */
foodRouter.post("/:foodID/review", auth, createFoodReview);

/**
 * @swagger
 * /api/food/remove:
 *   post:
 *     summary: Seller removes food (Seller/Admin only)
 *     tags: [Food]
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
 *         description: Food removed successfully
 *       403:
 *         description: Access denied - not your food or insufficient privileges
 */
foodRouter.post("/remove", auth, requireSeller, removeFood);

export default foodRouter;

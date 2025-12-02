import express from "express";
import { addFood, listFood, removeFood } from "../controllers/foodController.js";
import multer from "multer";
import authMiddleware from "../middleware/auth.js";

const foodRouter = express.Router();

// Image storage config
const storage= multer.diskStorage({
    destination:"uploads",
    filename:(req,file,cb)=>{
        return cb(null,`${Date.now()}${file.originalname}`)
    }
})

const upload = multer({ storage });

/**
 * @swagger
 * /api/food/add:
 *   post:
 *     tags:
 *       - Food
 *     summary: Add new food item (Seller only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Food item added successfully
 *       401:
 *         description: Not authenticated
 */
foodRouter.post("/add", upload.single("image"), authMiddleware, addFood);

/**
 * @swagger
 * /api/food/list:
 *   get:
 *     tags:
 *       - Food
 *     summary: Get all food items
 *     responses:
 *       200:
 *         description: List of all food items
 *       500:
 *         description: Server error
 */
foodRouter.get("/list", listFood);

/**
 * @swagger
 * /api/food/remove:
 *   post:
 *     tags:
 *       - Food
 *     summary: Remove food item (Seller only)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Food item removed successfully
 *       401:
 *         description: Not authenticated
 */
foodRouter.post("/remove", authMiddleware, removeFood);

export default foodRouter;

import express from "express";
import { registerSchema, loginSchema } from "../validations/authValidation.js";
import { validate } from "../middleware/validateMiddleware.js";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: Authentication APIs
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *                 description: Full name of the user
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *                 description: Valid email address
 *               password:
 *                 type: string
 *                 example: Password123
 *                 description: Password (min 8 chars, must contain uppercase, lowercase, and numbers)
 *               phoneNumber:
 *                 type: string
 *                 example: "+84123456789"
 *                 description: Phone number in +84XXXXXXXXX format (optional)
 *               dob:
 *                 type: string
 *                 example: "15-01-1990"
 *                 description: Date of birth in dd-mm-yyyy format (optional)
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *                 example: Male
 *                 description: Gender (optional)
 *               address:
 *                 type: string
 *                 example: "123 Main Street, Ho Chi Minh City"
 *                 description: Home address (optional)
 *     responses:
 *       200:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Register success
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 role:
 *                   type: string
 *                   example: user
 *                 userID:
 *                   type: string
 *                   example: U1234567890_abc123
 *       400:
 *         description: Validation error or email already exists
 */
router.post("/register", validate(registerSchema), registerUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *                 description: Registered email address
 *               password:
 *                 type: string
 *                 example: Password123
 *                 description: User password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Login success
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 role:
 *                   type: string
 *                   example: user
 *                 userID:
 *                   type: string
 *                   example: U1234567890_abc123
 *                 name:
 *                   type: string
 *                   example: John Doe
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", validate(loginSchema), loginUser);

export default router;

import express from "express";
import { registerSchema, loginSchema } from "../validations/authValidation.js";
import { validate } from "../middleware/validateMiddleware.js";
import { registerUser, loginUser, getCurrentUser, markOnboardingShown, markProfileCompleted } from "../controllers/authController.js";
import auth from "../middleware/authMiddleware.js";

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
 *     summary: Login user and receive JWT token
 *     tags: [Auth]
 *     description: |
 *       Authenticate user with email and password. Returns a JWT token that must be included 
 *       in the Authorization header for protected routes.
 *       
 *       **How to use the token:**
 *       1. Copy the token from the response
 *       2. Click the "Authorize" button at the top of this page
 *       3. Enter: `Bearer <your-token-here>`
 *       4. Click "Authorize" to authenticate all subsequent requests
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
 *                 description: User password (min 8 chars, must contain uppercase, lowercase, and numbers)
 *     responses:
 *       200:
 *         description: Login successful - Returns JWT token and user information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 msg:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                   description: JWT token - Use this in Authorization header as "Bearer <token>"
 *                 role:
 *                   type: string
 *                   example: buyer
 *                   enum: [buyer, seller, admin]
 *                   description: User role
 *                 userID:
 *                   type: string
 *                   example: U1234567890_abc123
 *                 name:
 *                   type: string
 *                   example: John Doe
 *                 displayName:
 *                   type: string
 *                   example: Johnny
 *                 email:
 *                   type: string
 *                   example: john@example.com
 *                 profileCompleted:
 *                   type: boolean
 *                   example: false
 *                 onboardingShown:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Bad request - Email and password are required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Email and password are required
 *       401:
 *         description: Unauthorized - Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Invalid credentials
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: Server error during login
 */
router.post("/login", validate(loginSchema), loginUser);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user info
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 */
router.get("/me", auth, getCurrentUser);

/**
 * @swagger
 * /api/auth/mark-onboarding-shown:
 *   put:
 *     summary: Mark onboarding as shown for seller
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Onboarding marked as shown
 */
router.put("/mark-onboarding-shown", auth, markOnboardingShown);

/**
 * @swagger
 * /api/auth/mark-profile-completed:
 *   put:
 *     summary: Mark profile as completed for seller
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile marked as completed
 */
router.put("/mark-profile-completed", auth, markProfileCompleted);

export default router;

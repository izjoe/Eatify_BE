// routes/userRoute.js
import express from "express";
import { validate } from "../middleware/validateMiddleware.js";
import {
  updateUserSchema
} from "../validations/userValidation.js";
import {
  updateUserRoleSchema,
  adminUpdateUserSchema
} from "../validations/adminValidation.js";
import auth, { requireAdmin } from "../middleware/authMiddleware.js";

import {
  loginUser,
  registerUser,
  getProfile,
  updateProfile,
  adminUpdateUser,
  adminUpdateRole
} from "../controllers/userController.js";

const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Auth
 *     description: User authentication
 *   - name: User
 *     description: User profile
 *   - name: Admin
 *     description: Admin user management
 */

/**
 * @swagger
 * /api/user/register:
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
 *                 example: Nguyen Ngoc
 *                 description: Full name of the user
 *               email:
 *                 type: string
 *                 format: email
 *                 example: ngoc@gmail.com
 *                 description: Valid email address
 *               password:
 *                 type: string
 *                 example: "Password123"
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
 *                 role:
 *                   type: string
 *                   example: user
 *                 userID:
 *                   type: string
 *       400:
 *         description: Validation error or email already exists
 */
userRouter.post("/register", registerUser);

/**
 * @swagger
 * /api/user/login:
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
 *                 example: ngoc@gmail.com
 *                 description: Registered email address
 *               password:
 *                 type: string
 *                 example: "Password123"
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
 *                 role:
 *                   type: string
 *                   example: user
 *                 userID:
 *                   type: string
 *                 name:
 *                   type: string
 *                   example: Nguyen Ngoc
 *       401:
 *         description: Invalid credentials
 */
userRouter.post("/login", loginUser);

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Nguyen Ngoc
 *                     email:
 *                       type: string
 *                       example: ngoc@gmail.com
 *                     role:
 *                       type: string
 *                       example: user
 *                     address:
 *                       type: string
 *                     phoneNumber:
 *                       type: string
 *                     dob:
 *                       type: string
 *                     gender:
 *                       type: string
 *                     profileImage:
 *                       type: string
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
userRouter.get("/profile", auth, getProfile);

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe Updated
 *                 description: User's full name
 *               userName:
 *                 type: string
 *                 example: johndoe_123
 *                 description: Username (letters, numbers, underscores only)
 *               email:
 *                 type: string
 *                 format: email
 *                 example: newemail@example.com
 *                 description: Email address
 *               address:
 *                 type: string
 *                 example: "456 New Street, District 1"
 *                 description: Home address
 *               phoneNumber:
 *                 type: string
 *                 example: "+84987654321"
 *                 description: Phone number in +84XXXXXXXXX format
 *               dob:
 *                 type: string
 *                 example: "20-05-1995"
 *                 description: Date of birth in dd-mm-yyyy format
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *                 example: Female
 *                 description: Gender
 *               profileImage:
 *                 type: string
 *                 example: "profile_123.jpg"
 *                 description: Profile image filename
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: Updated user profile data
 *       400:
 *         description: Validation error
 */
userRouter.put("/profile", auth, validate(updateUserSchema), updateProfile);

/**
 * @swagger
 * /api/user/admin/update-role:
 *   put:
 *     summary: Admin updates user's role
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - targetUserId
 *               - newRole
 *             properties:
 *               targetUserId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *                 description: MongoDB _id of the target user
 *               newRole:
 *                 type: string
 *                 enum: [user, seller, admin]
 *                 example: seller
 *                 description: New role to assign
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       403:
 *         description: Access denied - Admin privileges required
 */
userRouter.put(
  "/admin/update-role",
  auth,
  requireAdmin,
  validate(updateUserRoleSchema),
  adminUpdateRole
);

/**
 * @swagger
 * /api/user/admin/update-user:
 *   put:
 *     summary: Admin updates user details
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - targetUserId
 *             properties:
 *               targetUserId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *                 description: MongoDB _id of the target user
 *               name:
 *                 type: string
 *                 example: John Smith
 *                 description: User's full name
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johnsmith@example.com
 *                 description: Email address
 *               address:
 *                 type: string
 *                 example: "789 Admin Street"
 *                 description: Home address
 *               phoneNumber:
 *                 type: string
 *                 example: "+84123123123"
 *                 description: Phone number in +84XXXXXXXXX format
 *               dob:
 *                 type: string
 *                 example: "10-10-1990"
 *                 description: Date of birth in dd-mm-yyyy format
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *                 example: Male
 *                 description: Gender
 *     responses:
 *       200:
 *         description: User updated successfully
 *       403:
 *         description: Access denied - Admin privileges required
 */

userRouter.put(
  "/admin/update-user",
  auth,
  requireAdmin,
  validate(adminUpdateUserSchema),
  adminUpdateUser
);

export default userRouter;

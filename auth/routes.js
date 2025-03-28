import express from "express";
import AuthController from "./controller.js";
import AuthValidator from "./validator.js";
import { validationResult } from "express-validator";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const validateRequest = (validations) => [
  validations,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }
    next();
  },
];

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
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
 *               - passwordConfirm
 *               - plan
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "SecurePass123"
 *               passwordConfirm:
 *                 type: string
 *                 example: "SecurePass123"
 *               phone:
 *                 type: string
 *                 example: "+911234567890"
 *               organization:
 *                 type: string
 *                 example: "TechCorp"
 *               plan:
 *                 type: string
 *                 enum: ["basic", "premium"]
 *                 example: "basic"
 *     responses:
 *       201:
 *         description: User registered successfully
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
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                         plan:
 *                           type: string
 *                     token:
 *                       type: string
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already in use
 */
router.post("/signup", validateRequest(AuthValidator.signupValidation), AuthController.signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Authenticate user and return token
 *     tags: [Authentication]
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
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "SecurePass123"
 *     responses:
 *       200:
 *         description: Successful login
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
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                         plan:
 *                           type: string
 *                     token:
 *                       type: string
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", validateRequest(AuthValidator.loginValidation), AuthController.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       500:
 *         description: Server error
 */
router.post("/logout", AuthController.logout);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request a password reset link
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
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
 *                     resetToken:
 *                       type: string
 *                 message:
 *                   type: string
 *       400:
 *         description: Validation error
 *       404:
 *         description: User not found
 */
router.post("/forgot-password", validateRequest(AuthValidator.forgotPasswordValidation), AuthController.forgotPassword);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset user password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *               - passwordConfirm
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 example: "NewSecurePass123"
 *               passwordConfirm:
 *                 type: string
 *                 example: "NewSecurePass123"
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Validation error or passwords don't match
 *       401:
 *         description: Invalid or expired token
 */
router.post("/reset-password", validateRequest(AuthValidator.changePasswordValidation), AuthController.resetPassword);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
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
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone:
 *                       type: string
 *                     organization:
 *                       type: string
 *                     plan:
 *                       type: string
 *       401:
 *         description: Unauthorized access
 */
router.get("/profile", authMiddleware, AuthController.getProfile);

/**
 * @swagger
 * /api/auth/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Authentication]
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
 *                 example: "Updated Name"
 *               phone:
 *                 type: string
 *                 example: "+911234567890"
 *               organization:
 *                 type: string
 *                 example: "Updated Org"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized access
 */
router.put("/profile", authMiddleware, validateRequest(AuthValidator.updateProfileValidation), AuthController.updateProfile);

export default router;
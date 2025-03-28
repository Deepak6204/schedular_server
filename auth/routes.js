import express from "express";
import AuthController from "./controller.js";
import AuthValidator from "./validator.js";
import { validationResult } from "express-validator";

const router = express.Router();

const validateRequest = (validations) => [
  validations,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
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
 *               phone:
 *                 type: string
 *                 example: "+911234567890"
 *               organization:
 *                 type: string
 *                 example: "TechCorp"
 *               plan:
 *                 type: string
 *                 enum: ["basic", "premium"]
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     plan:
 *                       type: string
 *       400:
 *         description: Validation error
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
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     plan:
 *                       type: string
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", validateRequest(AuthValidator.loginValidation), AuthController.login);

export default router;

import { body } from "express-validator";

export default class AuthValidator {
  static signupValidation = [
    body("name")
      .trim()
      .notEmpty().withMessage("Name is required")
      .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2-50 characters"),
    
    body("email")
      .trim()
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Invalid email format")
      .normalizeEmail(),
    
    body("password")
      .notEmpty().withMessage("Password is required")
      .isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
      .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
      .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
      .matches(/\d/).withMessage("Password must contain at least one number")
      .matches(/[@$!%*?&]/).withMessage("Password must contain at least one special character (@$!%*?&)"),
    
    body("passwordConfirm")
      .notEmpty().withMessage("Please confirm your password")
      .custom((value, { req }) => value === req.body.password).withMessage("Passwords do not match"),
    
    body("phone")
      .optional()
      .trim()
      .isMobilePhone().withMessage("Invalid phone number"),
    
    body("organization")
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage("Organization must be less than 100 characters"),
    
    body("plan")
      .notEmpty().withMessage("Plan is required")
      .isIn(["basic", "premium"]).withMessage("Plan must be either 'basic' or 'premium'")
  ];

  static loginValidation = [
    body("email")
      .trim()
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Invalid email format")
      .normalizeEmail(),
    
    body("password")
      .notEmpty().withMessage("Password is required")
  ];

  static forgotPasswordValidation = [
    body("email")
      .trim()
      .notEmpty().withMessage("Email is required")
      .isEmail().withMessage("Invalid email format")
      .normalizeEmail()
  ];

  static changePasswordValidation = [
    body("token")
      .notEmpty().withMessage("Token is required"),
    
    body("newPassword")
      .notEmpty().withMessage("New password is required")
      .isLength({ min: 8 }).withMessage("New password must be at least 8 characters")
      .matches(/[A-Z]/).withMessage("New password must contain at least one uppercase letter")
      .matches(/[a-z]/).withMessage("New password must contain at least one lowercase letter")
      .matches(/\d/).withMessage("New password must contain at least one number")
      .matches(/[@$!%*?&]/).withMessage("New password must contain at least one special character (@$!%*?&)"),
    
    body("passwordConfirm")
      .notEmpty().withMessage("Please confirm your new password")
      .custom((value, { req }) => value === req.body.newPassword).withMessage("Passwords do not match")
  ];

  static updateProfileValidation = [
    body("name")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 }).withMessage("Name must be between 2-50 characters"),
    
    body("phone")
      .optional()
      .trim()
      .isMobilePhone().withMessage("Invalid phone number"),
    
    body("organization")
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage("Organization must be less than 100 characters")
  ];
}
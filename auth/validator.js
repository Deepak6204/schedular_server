import { body } from "express-validator";

export default class AuthValidator {
  static signupValidation = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("phone").optional().isMobilePhone().withMessage("Invalid phone number"),
    body("plan").isIn(["basic", "premium"]).withMessage("Plan must be either 'basic' or 'premium'"),
  ];

  static loginValidation = [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("Password is required"),
  ];
}

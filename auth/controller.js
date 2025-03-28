import User from "./model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

dotenv.config();

// Validate required environment variables
// const requiredEnvVars = ['JWT_SECRET', 'JWT_ISSUER', 'JWT_AUDIENCE'];
// requiredEnvVars.forEach(env => {
//   if (!process.env[env]) {
//     console.error(`Missing required environment variable: ${env}`);
//     process.exit(1);
//   }
// });

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests from this IP, please try again later",
  skip: req => process.env.NODE_ENV === 'test'
});

const generateToken = (userId, email) => {
  return jwt.sign(
    { id: userId, email },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      // issuer: process.env.JWT_ISSUER,
      // audience: process.env.JWT_AUDIENCE
    }
  );
};

const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: parseInt(process.env.JWT_COOKIE_EXPIRES_IN || '3600000', 10)
  });
};

class AuthController {
  static async signup(req, res) {
    try {
      const { name, email, password, passwordConfirm, phone, organization, plan } = req.body;

      if (password !== passwordConfirm) {
        return res.status(400).json({ 
          success: false,
          error: "Passwords do not match" 
        });
      }

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ 
          success: false,
          error: "Email already in use" 
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const userId = await User.create({ 
        name, 
        email, 
        password: hashedPassword, 
        phone, 
        organization, 
        plan 
      });

      const token = generateToken(userId, email);
      setTokenCookie(res, token);

      res.status(201).json({ 
        success: true,
        data: { 
          user: { id: userId, name, email, plan },
          token 
        },
        message: "User registered successfully"
      });
    } catch (error) {
      console.error("Signup Error:", error);
      res.status(500).json({ 
        success: false,
        error: "An error occurred during registration" 
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ 
          success: false,
          error: "Invalid credentials" 
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false,
          error: "Invalid credentials" 
        });
      }

      const token = generateToken(user.id, user.email);
      setTokenCookie(res, token);

      res.status(200).json({ 
        success: true,
        data: {
          user: { 
            id: user.id, 
            name: user.name, 
            email: user.email, 
            plan: user.plan 
          },
          token
        },
        message: "Login successful"
      });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ 
        success: false,
        error: "An error occurred during login" 
      });
    }
  }

  static async logout(req, res) {
    try {
      res.clearCookie('token');
      res.status(200).json({ 
        success: true,
        message: "Logout successful" 
      });
    } catch (error) {
      console.error("Logout Error:", error);
      res.status(500).json({ 
        success: false,
        error: "An error occurred during logout" 
      });
    }
  }

  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      const resetToken = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

      // Get email template
      const emailContent = EmailTemplates.forgotPasswordTemplate(user.name, resetLink);

      // Send email
      const emailSent = await EmailService.sendEmail(user.email, "Password Reset Request", emailContent);

      if (!emailSent) {
        return res.status(500).json({
          success: false,
          error: "Failed to send reset email",
        });
      }

      res.status(200).json({
        success: true,
        message: "Password reset link sent to email",
      });
    } catch (error) {
      console.error("Forgot Password Error:", error);
      res.status(500).json({
        success: false,
        error: "An error occurred",
      });
    }
  }

  static async resetPassword(req, res) {
    try {
      const { token, newPassword, passwordConfirm } = req.body;

      if (newPassword !== passwordConfirm) {
        return res.status(400).json({ 
          success: false,
          error: "Passwords do not match" 
        });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      await User.updatePassword(decoded.id, hashedPassword);

      res.status(200).json({ 
        success: true,
        message: "Password reset successful" 
      });
    } catch (error) {
      console.error("Reset Password Error:", error);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false,
          error: "Password reset token has expired" 
        });
      }
      res.status(500).json({ 
        success: false,
        error: "An error occurred" 
      });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = req.user; // Set by auth middleware

      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          organization: user.organization,
          plan: user.plan,
        }
      });
    } catch (error) {
      console.error("Get Profile Error:", error);
      res.status(500).json({ 
        success: false,
        error: "An error occurred" 
      });
    }
  }

  static async updateProfile(req, res) {
    try {
      const { id } = req.user;
      const { name, phone, organization } = req.body;

      const updatedUser = await User.updateProfile(id, { 
        name, 
        phone, 
        organization 
      });

      res.status(200).json({ 
        success: true,
        data: { user: updatedUser },
        message: "Profile updated successfully"
      });
    } catch (error) {
      console.error("Update Profile Error:", error);
      res.status(500).json({ 
        success: false,
        error: "An error occurred" 
      });
    }
  }
}

export default AuthController;
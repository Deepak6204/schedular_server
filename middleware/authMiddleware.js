import jwt from "jsonwebtoken";
import User from "../auth/model.js"; 

const authMiddleware = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } 
    // Fallback to check for token in cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Not authorized to access this route"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User not found"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: "Invalid token"
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: "Token expired"
      });
    }

    res.status(500).json({
      success: false,
      error: "Authentication failed"
    });
  }
};

export default authMiddleware;
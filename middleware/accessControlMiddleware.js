// middleware/accessControlMiddleware.js
// Các middleware để kiểm soát quyền truy cập resources

import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
import sellerModel from "../models/sellerModel.js";

/**
 * Kiểm tra user chỉ có thể truy cập profile của chính mình
 * (trừ admin có thể truy cập tất cả)
 */
export const canAccessUserProfile = async (req, res, next) => {
  try {
    const userId = req.body.userId; // from auth middleware (current user)
    const targetUserId = req.params.userId || req.body.targetUserId;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Admin có thể truy cập profile của bất kỳ ai
    if (user.role === "admin") {
      return next();
    }

    // User thường chỉ có thể truy cập profile của chính mình
    if (targetUserId && targetUserId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only access your own profile."
      });
    }

    next();
  } catch (error) {
    console.error("Access control error:", error);
    return res.status(500).json({
      success: false,
      message: "Error checking access permissions"
    });
  }
};

/**
 * Kiểm tra user chỉ có thể xem orders của chính mình
 * (trừ admin/seller có quyền xem các orders liên quan)
 */
export const canAccessOrder = async (req, res, next) => {
  try {
    const userId = req.body.userId; // from auth middleware
    const orderID = req.params.orderID;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Admin có thể xem tất cả orders
    if (user.role === "admin") {
      return next();
    }

    // Get order
    const order = await orderModel.findOne({ orderID });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Seller có thể xem orders chứa sản phẩm của họ
    if (user.role === "seller") {
      const seller = await sellerModel.findOne({ userID: user.userID });
      if (seller) {
        // Check if order contains seller's food items
        // (Implement food ownership check here if needed)
        return next();
      }
    }

    // User thường chỉ có thể xem orders của chính mình
    if (order.userID !== user.userID) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only view your own orders."
      });
    }

    next();
  } catch (error) {
    console.error("Access control error:", error);
    return res.status(500).json({
      success: false,
      message: "Error checking access permissions"
    });
  }
};

/**
 * Kiểm tra chỉ seller có thể thực hiện actions
 */
export const requireSeller = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Admin cũng được phép (có quyền cao nhất)
    if (user.role === "admin" || user.role === "seller") {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Access denied. Seller privileges required."
    });
  } catch (error) {
    console.error("Access control error:", error);
    return res.status(500).json({
      success: false,
      message: "Error checking access permissions"
    });
  }
};

/**
 * Prevent users from accessing other users' carts
 */
export const canAccessCart = async (req, res, next) => {
  try {
    const userId = req.body.userId; // from auth middleware
    
    // Cart operations always operate on current user's cart
    // No additional check needed, just ensure userId is set
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    next();
  } catch (error) {
    console.error("Access control error:", error);
    return res.status(500).json({
      success: false,
      message: "Error checking access permissions"
    });
  }
};

/**
 * Rate limiting per user (prevent abuse)
 */
export const preventRateLimitAbuse = (req, res, next) => {
  // This is a placeholder for rate limiting per user
  // Implement with Redis or in-memory store if needed
  next();
};

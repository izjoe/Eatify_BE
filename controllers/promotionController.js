// controllers/promotionController.js
import promotionModel from "../models/promotionModel.js";
import sellerModel from "../models/sellerModel.js";
import userModel from "../models/userModel.js";

// Simple UUID alternative
const generateUUID = () => `${Date.now()}_${Math.random().toString(36).substring(7)}`;

// Create a new promotion
export const createPromotion = async (req, res) => {
  try {
    const {
      promotionTitle,
      discountCode,
      discountType,
      discountValue,
      minOrderAmount = 0,
      maxUsage = null,
      expiryDate,
      description = "",
      applicableCategories = [],
      maxDiscountAmount = null
    } = req.body;

    const userId = req.body.userId;

    // Validate required fields
    if (!promotionTitle || !discountCode || !discountType || !discountValue || !expiryDate) {
      return res.json({
        success: false,
        message: "Missing required fields: promotionTitle, discountCode, discountType, discountValue, expiryDate"
      });
    }

    // Validate discount type
    if (!["percentage", "fixed"].includes(discountType)) {
      return res.json({
        success: false,
        message: "discountType must be 'percentage' or 'fixed'"
      });
    }

    // Get user
    const user = await userModel.findOne({ _id: userId });
    if (!user) return res.json({ success: false, message: "User not found" });

    if (user.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Seller privileges required."
      });
    }

    // Get seller
    const seller = await sellerModel.findOne({ userID: user.userID });
    if (!seller) {
      return res.json({ success: false, message: "Seller profile not found." });
    }

    // Check if discount code already exists
    const existingCode = await promotionModel.findOne({ discountCode });
    if (existingCode) {
      return res.json({
        success: false,
        message: "Discount code already exists"
      });
    }

    // Validate dates
    const expiry = new Date(expiryDate);
    if (expiry <= new Date()) {
      return res.json({
        success: false,
        message: "Expiry date must be in the future"
      });
    }

    // Create promotion
    const promotion = new promotionModel({
      promotionID: generateUUID(),
      sellerID: seller.sellerID,
      promotionTitle,
      discountCode: discountCode.toUpperCase(),
      discountType,
      discountValue,
      minOrderAmount,
      maxUsage,
      expiryDate: expiry,
      description,
      applicableCategories,
      maxDiscountAmount,
      status: expiry > new Date() ? "active" : "expired"
    });

    await promotion.save();

    res.status(201).json({
      success: true,
      message: "Promotion created successfully",
      data: promotion
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error creating promotion." });
  }
};

// Get all promotions for a seller
export const getSellerPromotions = async (req, res) => {
  try {
    const userId = req.body.userId;

    const user = await userModel.findOne({ _id: userId });
    if (!user) return res.json({ success: false, message: "User not found" });

    if (user.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Seller privileges required."
      });
    }

    const seller = await sellerModel.findOne({ userID: user.userID });
    if (!seller) {
      return res.json({ success: false, message: "Seller profile not found." });
    }

    const promotions = await promotionModel.find({ sellerID: seller.sellerID })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: promotions
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching promotions." });
  }
};

// Update a promotion
export const updatePromotion = async (req, res) => {
  try {
    const { promotionID } = req.params;
    const {
      promotionTitle,
      discountValue,
      minOrderAmount,
      maxUsage,
      expiryDate,
      description,
      applicableCategories,
      maxDiscountAmount,
      status
    } = req.body;

    const userId = req.body.userId;

    const user = await userModel.findOne({ _id: userId });
    if (!user) return res.json({ success: false, message: "User not found" });

    if (user.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Seller privileges required."
      });
    }

    const seller = await sellerModel.findOne({ userID: user.userID });
    if (!seller) {
      return res.json({ success: false, message: "Seller profile not found." });
    }

    // Find promotion and verify ownership
    const promotion = await promotionModel.findOne({
      promotionID,
      sellerID: seller.sellerID
    });

    if (!promotion) {
      return res.json({
        success: false,
        message: "Promotion not found or access denied"
      });
    }

    // Update fields
    if (promotionTitle !== undefined) promotion.promotionTitle = promotionTitle;
    if (discountValue !== undefined) promotion.discountValue = discountValue;
    if (minOrderAmount !== undefined) promotion.minOrderAmount = minOrderAmount;
    if (maxUsage !== undefined) promotion.maxUsage = maxUsage;
    if (description !== undefined) promotion.description = description;
    if (applicableCategories !== undefined) promotion.applicableCategories = applicableCategories;
    if (maxDiscountAmount !== undefined) promotion.maxDiscountAmount = maxDiscountAmount;
    if (status !== undefined && ["active", "expired", "paused"].includes(status)) {
      promotion.status = status;
    }

    if (expiryDate !== undefined) {
      const expiry = new Date(expiryDate);
      if (expiry <= new Date()) {
        return res.json({
          success: false,
          message: "Expiry date must be in the future"
        });
      }
      promotion.expiryDate = expiry;
    }

    await promotion.save();

    res.json({
      success: true,
      message: "Promotion updated successfully",
      data: promotion
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error updating promotion." });
  }
};

// Delete a promotion
export const deletePromotion = async (req, res) => {
  try {
    const { promotionID } = req.params;
    const userId = req.body.userId;

    const user = await userModel.findOne({ _id: userId });
    if (!user) return res.json({ success: false, message: "User not found" });

    if (user.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Seller privileges required."
      });
    }

    const seller = await sellerModel.findOne({ userID: user.userID });
    if (!seller) {
      return res.json({ success: false, message: "Seller profile not found." });
    }

    const promotion = await promotionModel.findOneAndDelete({
      promotionID,
      sellerID: seller.sellerID
    });

    if (!promotion) {
      return res.json({
        success: false,
        message: "Promotion not found or access denied"
      });
    }

    res.json({
      success: true,
      message: "Promotion deleted successfully"
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error deleting promotion." });
  }
};

// Validate a promotion code
export const validatePromotionCode = async (req, res) => {
  try {
    const { code, orderAmount = 0 } = req.body;

    if (!code) {
      return res.json({
        success: false,
        message: "Promotion code is required"
      });
    }

    const promotion = await promotionModel.findOne({
      discountCode: code.toUpperCase(),
      status: "active"
    });

    if (!promotion) {
      return res.json({
        success: false,
        message: "Invalid or expired promotion code"
      });
    }

    // Check if code has reached max usage
    if (promotion.maxUsage && promotion.usageCount >= promotion.maxUsage) {
      return res.json({
        success: false,
        message: "Promotion code has reached maximum usage limit"
      });
    }

    // Check minimum order amount
    if (orderAmount < promotion.minOrderAmount) {
      return res.json({
        success: false,
        message: `Minimum order amount is ${promotion.minOrderAmount}`
      });
    }

    // Check expiry date
    if (promotion.expiryDate < new Date()) {
      return res.json({
        success: false,
        message: "Promotion code has expired"
      });
    }

    res.json({
      success: true,
      message: "Promotion code is valid",
      data: {
        promotionID: promotion.promotionID,
        discountType: promotion.discountType,
        discountValue: promotion.discountValue,
        maxDiscountAmount: promotion.maxDiscountAmount
      }
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error validating promotion code." });
  }
};

// Apply promotion and calculate discount
export const applyPromotion = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;

    if (!code || !orderAmount) {
      return res.json({
        success: false,
        message: "Code and orderAmount are required"
      });
    }

    const promotion = await promotionModel.findOne({
      discountCode: code.toUpperCase(),
      status: "active"
    });

    if (!promotion) {
      return res.json({
        success: false,
        message: "Invalid or expired promotion code"
      });
    }

    // Check if code has reached max usage
    if (promotion.maxUsage && promotion.usageCount >= promotion.maxUsage) {
      return res.json({
        success: false,
        message: "Promotion code has reached maximum usage limit"
      });
    }

    // Check minimum order amount
    if (orderAmount < promotion.minOrderAmount) {
      return res.json({
        success: false,
        message: `Minimum order amount is ${promotion.minOrderAmount}`
      });
    }

    // Check expiry date
    if (promotion.expiryDate < new Date()) {
      return res.json({
        success: false,
        message: "Promotion code has expired"
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (promotion.discountType === "percentage") {
      discountAmount = (orderAmount * promotion.discountValue) / 100;
      // Apply max discount if set
      if (promotion.maxDiscountAmount && discountAmount > promotion.maxDiscountAmount) {
        discountAmount = promotion.maxDiscountAmount;
      }
    } else if (promotion.discountType === "fixed") {
      discountAmount = promotion.discountValue;
    }

    const finalAmount = Math.max(0, orderAmount - discountAmount);

    res.json({
      success: true,
      message: "Discount applied successfully",
      data: {
        promotionID: promotion.promotionID,
        originalAmount: orderAmount,
        discountAmount,
        finalAmount,
        discountType: promotion.discountType,
        discountValue: promotion.discountValue
      }
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error applying promotion." });
  }
};

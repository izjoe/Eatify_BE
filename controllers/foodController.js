import foodModel from "../models/foodModel.js";
import sellerModel from "../models/sellerModel.js";
import userModel from "../models/userModel.js";
import fs from "fs";

// Seller adds a new food item
export const addFood = async (req, res) => {
  try {
    const { foodName, description, price, category } = req.body;
    const userId = req.body.userId; // from auth middleware

    // Validate required file
    if (!req.file) {
      return res.json({ success: false, message: "Food image is required." });
    }

    // Get user from database
    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });
    
    // Check if user is a seller
    if (user.role !== "seller") {
      return res.json({ success: false, message: "Only sellers can add food." });
    }

    const userID = user.userID;

    // Find seller by userID
    const seller = await sellerModel.findOne({ userID });
    if (!seller) {
      return res.json({ success: false, message: "Seller profile not found." });
    }
    
    const sellerID = seller.sellerID;

    // Generate unique foodID with random component to avoid collisions
    const foodID = `F${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const food = new foodModel({
      foodID,
      sellerID,
      foodName,
      description,
      price: Number(price),
      category,
      foodImage: req.file.filename,
      stock: 0, // Default stock
      isAvailable: true
    });

    await food.save();
    res.json({ success: true, message: "Food added successfully.", foodID });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error adding food.", error: error.message });
  }
};

// List all foods
export const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching foods." });
  }
};

// Remove a food item
export const removeFood = async (req, res) => {
  try {
    const { foodID } = req.body;
    const userId = req.body.userId; // from auth middleware

    // Get user from database
    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });
    
    const userID = user.userID;

    // Find seller by userID
    const seller = await sellerModel.findOne({ userID });
    if (!seller) {
      return res.json({ success: false, message: "Seller not found." });
    }
    const sellerID = seller.sellerID;

    // SECURITY: Check ownership - seller can only delete their own food
    const food = await foodModel.findOne({ foodID, sellerID });
    if (!food) {
      return res.json({ success: false, message: "Food not found or you don't have permission to delete it." });
    }

    // Delete image file
    fs.unlink(`uploads/${food.foodImage}`, (err) => {
      if (err) console.error("Error deleting image:", err);
    });
    
    await foodModel.findOneAndDelete({ foodID, sellerID });

    res.json({ success: true, message: "Food removed successfully." });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error removing food.", error: error.message });
  }
};

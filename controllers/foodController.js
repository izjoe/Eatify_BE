import foodModel from "../models/foodModel.js";
import sellerModel from "../models/sellerModel.js";
import userModel from "../models/userModel.js";
import fs from "fs";

// Seller adds a new food item
export const addFood = async (req, res) => {
  try {
    const { foodName, description, price, category } = req.body;
    const userId = req.body.userId; // from auth middleware

    // Get user's userID from the database
    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });
    const userID = user.userID;

    // Find seller by userID
    const seller = await sellerModel.findOne({ userID });
    if (!seller) {
      return res.json({ success: false, message: "Seller not found. Only sellers can add food." });
    }
    const sellerID = seller.sellerID;
    if (!seller) {
      return res.json({ success: false, message: "Seller not found." });
    }

    const food = new foodModel({
      foodID: "F" + Date.now(),
      sellerID,
      foodName,
      description,
      price,
      category,
      foodImage: req.file.filename
    });

    await food.save();
    res.json({ success: true, message: "Food added successfully." });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error adding food." });
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

    // Get user's userID from the database
    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });
    const userID = user.userID;

    // Find seller by userID
    const seller = await sellerModel.findOne({ userID });
    if (!seller) {
      return res.json({ success: false, message: "Seller not found." });
    }
    const sellerID = seller.sellerID;

    const food = await foodModel.findOne({ foodID, sellerID });
    if (!food) {
      return res.json({ success: false, message: "Food not found." });
    }

    fs.unlink(`uploads/${food.foodImage}`, () => {});
    await foodModel.findOneAndDelete({ foodID, sellerID });

    res.json({ success: true, message: "Food removed." });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error removing food." });
  }
};

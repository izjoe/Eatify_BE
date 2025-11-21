import foodModel from "../models/foodModel.js";
import sellerModel from "../models/sellerModel.js";
import fs from "fs";

// Seller adds a new food item
export const addFood = async (req, res) => {
  try {
    const { sellerID, foodName, description, price, category } = req.body;

    const seller = await sellerModel.findOne({ sellerID });
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
    const { foodID, sellerID } = req.body;

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

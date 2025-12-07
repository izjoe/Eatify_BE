import foodModel from "../models/foodModel.js";
import sellerModel from "../models/sellerModel.js";
import userModel from "../models/userModel.js";
import ratingModel from "../models/ratingModel.js";
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

// List all foods with seller info and average rating
export const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    
    // Get all unique sellerIDs
    const sellerIDs = [...new Set(foods.map(f => f.sellerID))];
    
    // Fetch all sellers in one query
    const sellers = await sellerModel.find({ sellerID: { $in: sellerIDs } });
    const sellerMap = {};
    sellers.forEach(s => {
      sellerMap[s.sellerID] = {
        storeName: s.storeName,
        storeImage: s.storeImage,
        storeAddress: s.storeAddress,
        sellerId: s._id
      };
    });
    
    // Get all ratings and calculate average for each food
    const allFoodIDs = foods.map(f => f.foodID);
    const ratings = await ratingModel.find({ foodID: { $in: allFoodIDs } });
    
    // Calculate average rating for each food
    const ratingMap = {};
    allFoodIDs.forEach(foodID => {
      const foodRatings = ratings.filter(r => r.foodID === foodID);
      if (foodRatings.length > 0) {
        const avgRating = foodRatings.reduce((sum, r) => sum + r.rating, 0) / foodRatings.length;
        ratingMap[foodID] = {
          averageRating: Math.round(avgRating * 10) / 10,
          totalRatings: foodRatings.length
        };
      } else {
        ratingMap[foodID] = { averageRating: 0, totalRatings: 0 };
      }
    });
    
    // Combine food data with seller info and ratings
    const foodsWithDetails = foods.map(food => ({
      ...food.toObject(),
      seller: sellerMap[food.sellerID] || null,
      rating: ratingMap[food.foodID] || { averageRating: 0, totalRatings: 0 }
    }));
    
    res.json({ success: true, data: foodsWithDetails });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching foods." });
  }
};

// Get single food by ID with seller info and ratings
export const getFoodById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find food by foodID first, then try _id if it looks like ObjectId
    let food = await foodModel.findOne({ foodID: id });
    
    // If not found by foodID and id looks like valid ObjectId, try _id
    if (!food && id.match(/^[0-9a-fA-F]{24}$/)) {
      food = await foodModel.findById(id);
    }
    
    if (!food) {
      return res.json({ success: false, message: "Food not found." });
    }
    
    // Get seller info
    const seller = await sellerModel.findOne({ sellerID: food.sellerID });
    
    // Get all ratings for this food
    const ratings = await ratingModel.find({ foodID: food.foodID })
      .sort({ createdAt: -1 });
    
    // Get user info for each rating
    const userIDs = [...new Set(ratings.map(r => r.userID))];
    const users = await userModel.find({ userID: { $in: userIDs } });
    const userMap = {};
    users.forEach(u => {
      userMap[u.userID] = {
        name: u.name,
        profileImage: u.profileImage
      };
    });
    
    // Combine ratings with user info
    const ratingsWithUser = ratings.map(r => ({
      ...r.toObject(),
      user: userMap[r.userID] || { name: 'Unknown', profileImage: null }
    }));
    
    // Calculate average rating
    const avgRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;
    
    const foodWithDetails = {
      ...food.toObject(),
      seller: seller ? {
        storeName: seller.storeName,
        storeImage: seller.storeImage,
        storeAddress: seller.storeAddress,
        sellerId: seller._id,
        sellerID: seller.sellerID
      } : null,
      rating: {
        averageRating: Math.round(avgRating * 10) / 10,
        totalRatings: ratings.length
      },
      reviews: ratingsWithUser
    };
    
    res.json({ success: true, data: foodWithDetails });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching food.", error: error.message });
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

// Get all foods belonging to a restaurant/seller
export const getRestaurantFoods = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    
    // Find seller by _id or sellerID
    const seller = await sellerModel.findOne({
      $or: [{ _id: restaurantId }, { sellerID: restaurantId }]
    });
    
    if (!seller) {
      return res.status(404).json({ success: false, message: "Restaurant not found." });
    }
    
    // Get all foods for this seller
    const foods = await foodModel.find({ sellerID: seller.sellerID });
    
    // Get ratings for all foods
    const allFoodIDs = foods.map(f => f.foodID);
    const ratings = await ratingModel.find({ foodID: { $in: allFoodIDs } });
    
    // Calculate average rating for each food
    const ratingMap = {};
    allFoodIDs.forEach(foodID => {
      const foodRatings = ratings.filter(r => r.foodID === foodID);
      if (foodRatings.length > 0) {
        const avgRating = foodRatings.reduce((sum, r) => sum + r.rating, 0) / foodRatings.length;
        ratingMap[foodID] = {
          averageRating: Math.round(avgRating * 10) / 10,
          totalRatings: foodRatings.length
        };
      } else {
        ratingMap[foodID] = { averageRating: 0, totalRatings: 0 };
      }
    });
    
    // Combine food data with ratings
    const foodsWithRatings = foods.map(food => ({
      ...food.toObject(),
      rating: ratingMap[food.foodID] || { averageRating: 0, totalRatings: 0 }
    }));
    
    res.json({ 
      success: true, 
      data: foodsWithRatings,
      restaurant: {
        _id: seller._id,
        sellerID: seller.sellerID,
        storeName: seller.storeName,
        storeDescription: seller.storeDescription,
        storeAddress: seller.storeAddress,
        storeImage: seller.storeImage,
        categories: seller.categories,
        averageRating: seller.averageRating
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching restaurant foods.", error: error.message });
  }
};

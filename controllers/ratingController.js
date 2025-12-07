import RatingModel from "../models/ratingModel.js";
import foodModel from "../models/foodModel.js";
import userModel from "../models/userModel.js";

// Create a new review for a food item
export const rateFood = async (req, res) => {
  try {
    const { foodID, rating, comment } = req.body;
    const userId = req.body.userId; // from auth middleware

    // Get user's userID from the database
    const user = await userModel.findById(userId);
    if (!user) return res.status(400).json({ success: false, message: "User not found" });
    const userID = user.userID;

    // Check if food exists
    const food = await foodModel.findOne({ foodID });
    if (!food) return res.status(404).json({ success: false, message: "Food not found" });

    // Check if user already reviewed this food
    const existingReview = await RatingModel.findOne({ userID, foodID });
    if (existingReview) {
      return res.status(400).json({ 
        success: false, 
        message: "You have already reviewed this food item" 
      });
    }

    const newRating = new RatingModel({
      ratingID: "RT" + Date.now(),
      userID,
      foodID,
      rating,
      comment,
      userName: user.name,
      userAvatar: user.profileImage
    });

    await newRating.save();

    // Update food's average rating
    await updateFoodAverageRating(foodID);

    res.json({
      success: true,
      message: "Review submitted successfully.",
      data: newRating
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while submitting review.",
      error: error.message
    });
  }
};

// Get all reviews for a food item
export const getFoodReviews = async (req, res) => {
  try {
    const { foodID } = req.params;

    // Get all reviews sorted by newest first
    const reviews = await RatingModel.find({ foodID })
      .sort({ createdAt: -1 });

    // Get user info for each review (in case userName wasn't stored)
    const userIDs = [...new Set(reviews.map(r => r.userID))];
    const users = await userModel.find({ userID: { $in: userIDs } });
    const userMap = {};
    users.forEach(u => {
      userMap[u.userID] = {
        name: u.name,
        profileImage: u.profileImage
      };
    });

    // Combine reviews with user info
    const reviewsWithUser = reviews.map(r => ({
      _id: r._id,
      ratingID: r.ratingID,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      user: {
        name: r.userName || userMap[r.userID]?.name || 'Người dùng ẩn danh',
        profileImage: r.userAvatar || userMap[r.userID]?.profileImage || null
      }
    }));

    res.json({
      success: true,
      data: reviewsWithUser,
      total: reviewsWithUser.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching reviews.",
      error: error.message
    });
  }
};

// Create review via food ID in URL (POST /api/food/:foodID/review)
export const createFoodReview = async (req, res) => {
  try {
    const { foodID } = req.params;
    const { rating, comment } = req.body;
    const userId = req.userId || req.body.userId; // from auth middleware

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        message: "Rating must be between 1 and 5" 
      });
    }

    // Get user
    const user = await userModel.findById(userId);
    if (!user) return res.status(400).json({ success: false, message: "User not found" });
    const userID = user.userID;

    // Check if food exists
    const food = await foodModel.findOne({ 
      $or: [{ foodID }, { _id: foodID }] 
    });
    if (!food) return res.status(404).json({ success: false, message: "Food not found" });

    const actualFoodID = food.foodID;

    // Check if user already reviewed this food
    const existingReview = await RatingModel.findOne({ userID, foodID: actualFoodID });
    if (existingReview) {
      return res.status(400).json({ 
        success: false, 
        message: "Bạn đã đánh giá món ăn này rồi" 
      });
    }

    const newRating = new RatingModel({
      ratingID: "RT" + Date.now() + "_" + Math.random().toString(36).substring(7),
      userID,
      foodID: actualFoodID,
      rating: Number(rating),
      comment: comment || '',
      userName: user.name,
      userAvatar: user.profileImage
    });

    await newRating.save();

    // Update food's average rating
    await updateFoodAverageRating(actualFoodID);

    res.json({
      success: true,
      message: "Đánh giá đã được gửi thành công!",
      data: {
        _id: newRating._id,
        ratingID: newRating.ratingID,
        rating: newRating.rating,
        comment: newRating.comment,
        createdAt: newRating.createdAt,
        user: {
          name: user.name,
          profileImage: user.profileImage
        }
      }
    });

  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi gửi đánh giá.",
      error: error.message
    });
  }
};

// Helper function to update food's average rating
async function updateFoodAverageRating(foodID) {
  const ratings = await RatingModel.find({ foodID });
  
  if (ratings.length === 0) {
    await foodModel.updateOne(
      { foodID },
      { averageRating: 0, totalRatings: 0 }
    );
    return;
  }

  const avgRating = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
  
  await foodModel.updateOne(
    { foodID },
    { 
      averageRating: Math.round(avgRating * 10) / 10,
      totalRatings: ratings.length
    }
  );
}

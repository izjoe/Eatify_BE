import RatingModel from "../models/ratingModel.js";
import userModel from "../models/userModel.js";

export const rateFood = async (req, res) => {
  try {
    const { foodID, rating, comment } = req.body;
    const userId = req.body.userId; // from auth middleware

    // Get user's userID from the database
    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });
    const userID = user.userID;

    const newRating = new RatingModel({
      ratingID: "RT" + Date.now(),
      userID,
      foodID,
      rating,
      comment
    });

    await newRating.save();

    res.json({
      success: true,
      message: "Food rating submitted successfully.",
      data: newRating
    });

  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Server error while submitting food rating."
    });
  }
};

import RatingModel from "../models/ratingModel.js";

export const rateFood = async (req, res) => {
  try {
    const { userID, foodID, rating, comment } = req.body;

    const newRating = new RatingModel({
      ratingID: "RT" + Date.now(),
      userID,
      foodID,
      rating,
      comment
    });

    await newRating.save();

    res.json({
      message: "Food rating submitted successfully.",
      data: newRating
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error while submitting food rating.",
      error: error.message
    });
  }
};

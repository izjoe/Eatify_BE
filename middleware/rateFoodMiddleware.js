import Order from "../models/orderModel.js";
import RatingModel from "../models/ratingModel.js";
import userModel from "../models/userModel.js";

export const canRateFood = async (req, res, next) => {
  try {
    const { foodID } = req.body;
    const userId = req.body.userId; // from auth middleware

    if (!userId || !foodID) {
      return res.status(400).json({ message: "Missing userId or foodID." });
    }

    // Get user's userID from the database
    const user = await userModel.findById(userId);
    if (!user) return res.status(400).json({ message: "User not found" });
    const userID = user.userID;

    // Check whether user has ever bought this food
    const hasBought = await Order.findOne({
      userID,
      "items.foodID": foodID
    });

    if (!hasBought) {
      return res.status(400).json({
        message: "You cannot rate this food because you have not purchased it."
      });
    }

    // Check if the order containing this food is completed
    const completedOrder = await Order.findOne({
      userID,
      "items.foodID": foodID,
      status: "completed"
    });

    if (!completedOrder) {
      return res.status(400).json({
        message: "You can only rate this food after the order is completed."
      });
    }

    // Check whether user already rated this food before
  const alreadyRated = await RatingModel.findOne({ userID, foodID });

    if (alreadyRated) {
      return res.status(400).json({
        message: "You have already rated this food."
      });
    }

    next();

  } catch (error) {
    console.error("canRateFood Middleware Error:", error.message);
    return res.status(500).json({
      message: "Server error while validating food rating permission.",
      error: error.message
    });
  }
};
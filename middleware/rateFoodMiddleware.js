import Order from "../models/orderModel.js";
import FoodRating from "../models/foodRatingModel.js";

export const canRateFood = async (req, res, next) => {
  try {
    const { userID, foodID } = req.body;

    if (!userID || !foodID) {
      return res.status(400).json({ message: "Missing userID or foodID." });
    }

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
    const alreadyRated = await FoodRating.findOne({ userID, foodID });

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
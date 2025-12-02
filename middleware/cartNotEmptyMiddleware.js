// Ensure the user has items in the cart before checking out.

import Cart from "../models/cartModel.js";
import userModel from "../models/userModel.js";

export const cartNotEmpty = async (req, res, next) => {
  try {
    const userId = req.body.userId; // from auth middleware

    // Get user's userID from the database
    const user = await userModel.findById(userId);
    if (!user) return res.status(400).json({ message: "User not found" });
    const userID = user.userID;

    const cart = await Cart.findOne({ userID });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Your cart is empty. Add items before checking out."
      });
    }

    next();

  } catch (error) {
    console.error("cartNotEmptyMiddleware Error:", error.message);
    return res.status(500).json({
      message: "Server error while checking cart status.",
      error: error.message
    });
  }
};

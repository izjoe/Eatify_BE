// Ensure the user has items in the cart before checking out.

import Cart from "../models/cartModel.js";

export const cartNotEmpty = async (req, res, next) => {
  try {
    const { userID } = req.body;

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

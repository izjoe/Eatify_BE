// controllers/cartController.js
import cartModel from "../models/cartModel.js";
import userModel from "../models/userModel.js";

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { foodID, quantity } = req.body;
    const userId = req.body.userId; // from auth middleware

    // Get user's userID from the database
    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });
    const userID = user.userID;

    let cart = await cartModel.findOne({ userID });

    // If cart doesn't exist → create a new one
    if (!cart) {
      cart = new cartModel({
        userID,
        items: [{ foodID, quantity: quantity || 1 }]
      });
      await cart.save();
      return res.json({ success: true, message: "Item added to cart." });
    }

    // If cart exists → update quantity
    const item = cart.items.find((i) => i.foodID === foodID);

    if (item) {
      item.quantity += quantity || 1;
    } else {
      cart.items.push({ foodID, quantity: quantity || 1 });
    }

    await cart.save();
    res.json({ success: true, message: "Item added to cart." });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error adding item to cart." });
  }
};

// Remove item (or reduce quantity)
export const removeFromCart = async (req, res) => {
  try {
    const { foodID } = req.body;
    const userId = req.body.userId; // from auth middleware

    // Get user's userID from the database
    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });
    const userID = user.userID;

    const cart = await cartModel.findOne({ userID });
    if (!cart) return res.json({ success: false, message: "Cart not found." });

    const item = cart.items.find((i) => i.foodID === foodID);

    if (!item)
      return res.json({ success: false, message: "Item not in cart." });

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart.items = cart.items.filter((i) => i.foodID !== foodID);
    }

    await cart.save();
    res.json({ success: true, message: "Item removed from cart." });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error removing item." });
  }
};

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const userId = req.body.userId; // from auth middleware

    // Get user's userID from the database
    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });
    const userID = user.userID;

    const cart = await cartModel.findOne({ userID });

    res.json({
      success: true,
      cartData: cart ? cart.items : []
    });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching cart." });
  }
};

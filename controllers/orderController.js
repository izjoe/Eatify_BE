// controllers/orderController.js
import orderModel from "../models/orderModel.js";
import cartModel from "../models/cartModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";

// Create order from cart
export const checkoutOrder = async (req, res) => {
  try {
    const userId = req.body.userId; // from auth middleware

    // Get user's userID from the database
    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });
    const userID = user.userID;

    // Auto-get delivery address and phone from user profile
    if (!user.address || !user.phoneNumber) {
      return res.json({ 
        success: false, 
        message: "Please complete your profile (address and phone number) before ordering." 
      });
    }

    const cart = await cartModel.findOne({ userID });
    if (!cart || cart.items.length === 0) {
      return res.json({ success: false, message: "Cart is empty." });
    }

    // Fetch food details and calculate prices
    const orderItems = [];
    let totalPrice = 0;

    for (const cartItem of cart.items) {
      const food = await foodModel.findOne({ foodID: cartItem.foodID });
      if (!food) {
        return res.json({ success: false, message: `Food ${cartItem.foodID} not found.` });
      }
      
      const itemPrice = food.price * cartItem.quantity;
      totalPrice += itemPrice;

      orderItems.push({
        foodID: cartItem.foodID,
        foodName: food.foodName,
        quantity: cartItem.quantity,
        price: food.price
      });
    }

    const order = new orderModel({
      orderID: "O" + Date.now(),
      userID,
      items: orderItems,
      totalPrice,
      deliveryAddress: user.address,
      phone: user.phoneNumber,
      isPaid: false,
      orderStatus: "pending"
    });

    await order.save();

    // Clear cart after checkout
    cart.items = [];
    await cart.save();

    res.json({ success: true, message: "Order placed successfully.", orderID: order.orderID, totalPrice });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error placing order." });
  }
};

// Update order status (validated by middleware)
export const updateStatus = async (req, res) => {
  try {
    const { orderID, newStatus } = req.body;

    await orderModel.findOneAndUpdate(
      { orderID },
      { orderStatus: newStatus }
    );

    res.json({ success: true, message: "Order status updated." });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error updating status." });
  }
};

// Verify payment (set isPaid = true) - ADMIN ONLY
export const verifyOrder = async (req, res) => {
  try {
    const { orderID, status } = req.body;
    const userId = req.body.userId; // from auth middleware

    // Check if user is admin
    const user = await userModel.findById(userId);
    if (!user || user.role !== "admin") {
      return res.json({ success: false, message: "Admin access required to verify payment." });
    }

    if (status === "success") {
      await orderModel.findOneAndUpdate(
        { orderID },
        { isPaid: true, orderStatus: "preparing" }
      );
      return res.json({ success: true, message: "Payment verified successfully." });
    }

    res.json({ success: false, message: "Payment verification failed." });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error verifying payment." });
  }
};

// Get orders of a user
export const userOrders = async (req, res) => {
  try {
    const userId = req.body.userId; // from auth middleware

    // Get user's userID from the database
    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });
    const userID = user.userID;

    const orders = await orderModel.find({ userID });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching orders." });
  }
};

// Admin: list all orders
export const listOrders = async (req, res) => {
  try {
    const userId = req.body.userId; // from auth middleware
    const users = await userModel.findById(userId);
    if (!users || users.role !== "admin") {
      return res.json({ success: false, message: "Admin access required." });
    }

    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching orders." });
  }
};

// Get order detail
export const getOrderDetail = async (req, res) => {
  try {
    const order = await orderModel.findOne({ orderID: req.params.orderID });
    res.json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching order detail." });
  }
};

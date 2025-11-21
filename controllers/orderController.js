// controllers/orderController.js
import orderModel from "../models/orderModel.js";
import cartModel from "../models/cartModel.js";
import userModel from "../models/userModel.js";

// Create order from cart
export const checkoutOrder = async (req, res) => {
  try {
    const { userID, deliveryAddress, phone } = req.body;

    const cart = await cartModel.findOne({ userID });
    if (!cart || cart.items.length === 0) {
      return res.json({ success: false, message: "Cart is empty." });
    }

    const order = new orderModel({
      orderID: "O" + Date.now(),
      userID,
      items: cart.items.map((i) => ({
        foodID: i.foodID,
        quantity: i.quantity,
        subtotal: 0
      })),
      totalPrice: 0,
      deliveryAddress,
      phone,
      isPaid: false,
      orderStatus: "pending"
    });

    await order.save();

    // Clear cart after checkout
    cart.items = [];
    await cart.save();

    res.json({ success: true, message: "Order placed successfully.", orderID: order.orderID });

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

// Verify payment (set isPaid = true)
export const verifyOrder = async (req, res) => {
  try {
    const { orderID, status } = req.body;

    if (status === "success") {
      await orderModel.findOneAndUpdate(
        { orderID },
        { isPaid: true, orderStatus: "preparing" }
      );
      return res.json({ success: true, message: "Payment successful." });
    }

    res.json({ success: false, message: "Payment failed." });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error verifying payment." });
  }
};

// Get orders of a user
export const userOrders = async (req, res) => {
  try {
    const { userID } = req.body;
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
    const users = await userModel.findById(req.body.userID);
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

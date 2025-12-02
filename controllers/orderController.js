// controllers/orderController.js
import orderModel from "../models/orderModel.js";
import cartModel from "../models/cartModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";
import sellerModel from "../models/sellerModel.js";

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
      
      // VALIDATION: Check if food is available
      if (!food.isAvailable) {
        return res.json({ 
          success: false, 
          message: `${food.foodName} is currently unavailable.` 
        });
      }
      
      // VALIDATION: Check stock (if stock tracking is enabled)
      if (food.stock !== undefined && food.stock < cartItem.quantity) {
        return res.json({ 
          success: false, 
          message: `Insufficient stock for ${food.foodName}. Available: ${food.stock}, Requested: ${cartItem.quantity}` 
        });
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
    const userId = req.body.userId; // from auth middleware

    // Get user from database
    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    // Get order
    const order = await orderModel.findOne({ orderID });
    if (!order) {
      return res.json({ success: false, message: "Order not found." });
    }

    // SECURITY: Only admin or order owner can update status
    // Customer can only cancel their own pending orders
    if (user.role === "user") {
      // Customer can only update their own orders
      if (order.userID !== user.userID) {
        return res.status(403).json({ 
          success: false, 
          message: "You can only update your own orders." 
        });
      }
      // Customer can only cancel
      if (newStatus !== "canceled") {
        return res.status(403).json({ 
          success: false, 
          message: "Customers can only cancel orders." 
        });
      }
    } else if (user.role === "seller") {
      // Seller can update orders that contain their food items
      // (This requires checking if order contains seller's food - implement if needed)
      // For now, allow seller to update any order
    } else if (user.role !== "admin") {
      return res.status(403).json({ 
        success: false, 
        message: "Permission denied." 
      });
    }

    await orderModel.findOneAndUpdate(
      { orderID },
      { orderStatus: newStatus }
    );

    res.json({ success: true, message: "Order status updated." });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error updating status.", error: error.message });
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

// Admin/Seller: list orders
export const listOrders = async (req, res) => {
  try {
    const userId = req.body.userId; // from auth middleware
    const user = await userModel.findById(userId);
    
    if (!user) {
      return res.json({ success: false, message: "User not found." });
    }

    let orders;
    
    if (user.role === "admin") {
      // Admin can see all orders
      orders = await orderModel.find({});
    } else if (user.role === "seller") {
      // Seller can only see orders containing their food items
      // First get seller's foods
      const seller = await sellerModel.findOne({ userID: user.userID });
      
      if (!seller) {
        return res.json({ success: false, message: "Seller profile not found." });
      }
      
      const sellerFoods = await foodModel.find({ sellerID: seller.sellerID });
      const foodIDs = sellerFoods.map(f => f.foodID);
      
      // Get orders that contain seller's food
      orders = await orderModel.find({
        "items.foodID": { $in: foodIDs }
      });
    } else {
      // Regular users should use /order/my endpoint
      return res.status(403).json({ 
        success: false, 
        message: "Access denied. Admin or Seller privileges required." 
      });
    }

    res.json({ success: true, data: orders });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching orders.", error: error.message });
  }
};

// Get order detail
export const getOrderDetail = async (req, res) => {
  try {
    const userId = req.body.userId; // from auth middleware
    const { orderID } = req.params;

    // Get user from database
    const user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    const order = await orderModel.findOne({ orderID });
    if (!order) {
      return res.json({ success: false, message: "Order not found." });
    }

    // SECURITY: Check ownership - user can only view their own orders (unless admin)
    if (user.role !== "admin" && order.userID !== user.userID) {
      return res.status(403).json({ 
        success: false, 
        message: "You don't have permission to view this order." 
      });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching order detail.", error: error.message });
  }
};

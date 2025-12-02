// Validate order status transitions before updating.

import Order from "../models/orderModel.js";

export const validateOrderStatus = async (req, res, next) => {
  try {
    const { orderID, newStatus } = req.body;

    const order = await Order.findOne({ orderID });
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    const current = order.orderStatus;
    const nextStatus = newStatus;

    // Forbidden transitions
    if (current === "completed") {
      return res.status(400).json({ message: "Completed orders cannot be modified." });
    }

    if (current === "canceled") {
      return res.status(400).json({ message: "Canceled orders cannot be modified." });
    }

    if (current === "shipping" && nextStatus === "canceled") {
      return res.status(400).json({
        message: "A shipping order cannot be canceled."
      });
    }

    // Allowed transitions matrix
    const allowedTransitions = {
      pending: ["preparing", "canceled"],
      preparing: ["shipping", "canceled"],
      shipping: ["completed"]
    };

    const allowedNext = allowedTransitions[current];

    if (!allowedNext || !allowedNext.includes(nextStatus)) {
      return res.status(400).json({
        message: `Invalid status transition: ${current} → ${nextStatus}`
      });
    }

    // Pass through if valid
    next();

  } catch (error) {
    console.error("validateOrderStatus Error:", error.message);
    return res.status(500).json({
      message: "Server error during order status validation.",
      error: error.message
    });
  }
};

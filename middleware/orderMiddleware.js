// middleware/orderMiddleware.js

// Auto update order status when payment changes
const updateOrderStatus = async (req, res, next) => {
  try {
    const { payment } = req.body;
    
    // If payment is being updated to true, set status to preparing
    if (payment === true && req.order && req.order.payment === false) {
      req.body.status = "preparing";
    }
    
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Validate order status transitions
const validateStatusTransition = (req, res, next) => {
  const validTransitions = {
    pending: ["preparing", "cancelled"],
    preparing: ["shipping", "cancelled"],
    shipping: ["completed", "cancelled"],
    completed: [],
    cancelled: []
  };
  
  const { status } = req.body;
  const currentStatus = req.order?.status;
  
  if (status && currentStatus) {
    if (!validTransitions[currentStatus].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot change status from ${currentStatus} to ${status}` 
      });
    }
  }
  
  next();
};

// Check payment before changing status
const checkPaymentBeforeStatus = (req, res, next) => {
  const { status } = req.body;
  const order = req.order;
  
  // Cannot move from pending to preparing if not paid
  if (order?.status === "pending" && status === "preparing" && order.payment === false) {
    return res.status(400).json({ 
      success: false, 
      message: "Order must be paid before preparing" 
    });
  }
  
  next();
};

export { updateOrderStatus, validateStatusTransition, checkPaymentBeforeStatus };
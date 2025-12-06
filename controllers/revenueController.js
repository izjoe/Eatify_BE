// controllers/revenueController.js
import orderModel from "../models/orderModel.js";
import sellerModel from "../models/sellerModel.js";
import userModel from "../models/userModel.js";

// Get today's revenue for seller
export const getDailyRevenue = async (req, res) => {
  try {
    const userId = req.body.userId; // from auth middleware

    // Get seller info
    const user = await userModel.findOne({ _id: userId });
    if (!user) return res.json({ success: false, message: "User not found" });

    if (user.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Seller privileges required."
      });
    }

    const seller = await sellerModel.findOne({ userID: user.userID });
    if (!seller) {
      return res.json({ success: false, message: "Seller profile not found." });
    }

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Aggregate today's revenue
    const dailyRevenue = await orderModel.aggregate([
      {
        $match: {
          "items.sellerID": seller.sellerID,
          createdAt: { $gte: today, $lt: tomorrow },
          isPaid: true
        }
      },
      {
        $unwind: "$items"
      },
      {
        $match: {
          "items.sellerID": seller.sellerID
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          orderCount: { $sum: 1 },
          uniqueOrders: { $addToSet: "$orderID" }
        }
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          orderCount: 1,
          uniqueOrderCount: { $size: "$uniqueOrders" }
        }
      }
    ]);

    const revenue = dailyRevenue.length > 0
      ? dailyRevenue[0]
      : { totalRevenue: 0, orderCount: 0, uniqueOrderCount: 0 };

    res.json({ success: true, data: revenue });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching daily revenue." });
  }
};

// Get monthly revenue for seller
export const getMonthlyRevenue = async (req, res) => {
  try {
    const userId = req.body.userId;

    const user = await userModel.findOne({ _id: userId });
    if (!user) return res.json({ success: false, message: "User not found" });

    if (user.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Seller privileges required."
      });
    }

    const seller = await sellerModel.findOne({ userID: user.userID });
    if (!seller) {
      return res.json({ success: false, message: "Seller profile not found." });
    }

    // Get current month range
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    lastDay.setHours(23, 59, 59, 999);

    // Aggregate monthly revenue
    const monthlyRevenue = await orderModel.aggregate([
      {
        $match: {
          "items.sellerID": seller.sellerID,
          createdAt: { $gte: firstDay, $lte: lastDay },
          isPaid: true
        }
      },
      {
        $unwind: "$items"
      },
      {
        $match: {
          "items.sellerID": seller.sellerID
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          orderCount: { $sum: 1 },
          uniqueOrders: { $addToSet: "$orderID" }
        }
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          orderCount: 1,
          uniqueOrderCount: { $size: "$uniqueOrders" }
        }
      }
    ]);

    const revenue = monthlyRevenue.length > 0
      ? monthlyRevenue[0]
      : { totalRevenue: 0, orderCount: 0, uniqueOrderCount: 0 };

    res.json({ success: true, data: revenue });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching monthly revenue." });
  }
};

// Get revenue by date range
export const getRevenueByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const userId = req.body.userId;

    if (!startDate || !endDate) {
      return res.json({
        success: false,
        message: "startDate and endDate are required (YYYY-MM-DD format)"
      });
    }

    const user = await userModel.findOne({ _id: userId });
    if (!user) return res.json({ success: false, message: "User not found" });

    if (user.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Seller privileges required."
      });
    }

    const seller = await sellerModel.findOne({ userID: user.userID });
    if (!seller) {
      return res.json({ success: false, message: "Seller profile not found." });
    }

    // Parse dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // Aggregate revenue by date range
    const rangeRevenue = await orderModel.aggregate([
      {
        $match: {
          "items.sellerID": seller.sellerID,
          createdAt: { $gte: start, $lte: end },
          isPaid: true
        }
      },
      {
        $unwind: "$items"
      },
      {
        $match: {
          "items.sellerID": seller.sellerID
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          orderCount: { $sum: 1 },
          uniqueOrders: { $addToSet: "$orderID" }
        }
      },
      {
        $project: {
          _id: 0,
          totalRevenue: 1,
          orderCount: 1,
          uniqueOrderCount: { $size: "$uniqueOrders" }
        }
      }
    ]);

    const revenue = rangeRevenue.length > 0
      ? rangeRevenue[0]
      : { totalRevenue: 0, orderCount: 0, uniqueOrderCount: 0 };

    res.json({
      success: true,
      data: {
        ...revenue,
        period: { startDate, endDate }
      }
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching revenue by date range." });
  }
};

// Get daily revenue breakdown (by day for chart visualization)
export const getRevenueChart = async (req, res) => {
  try {
    const { days = 30 } = req.body; // default 30 days
    const userId = req.body.userId;

    const user = await userModel.findOne({ _id: userId });
    if (!user) return res.json({ success: false, message: "User not found" });

    if (user.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Seller privileges required."
      });
    }

    const seller = await sellerModel.findOne({ userID: user.userID });
    if (!seller) {
      return res.json({ success: false, message: "Seller profile not found." });
    }

    // Calculate start date
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Aggregate revenue by day
    const chartData = await orderModel.aggregate([
      {
        $match: {
          "items.sellerID": seller.sellerID,
          createdAt: { $gte: startDate, $lte: endDate },
          isPaid: true
        }
      },
      {
        $unwind: "$items"
      },
      {
        $match: {
          "items.sellerID": seller.sellerID
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          revenue: 1,
          orders: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        chartData,
        period: { days, startDate, endDate }
      }
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching revenue chart data." });
  }
};

// Get order summary for seller
export const getOrderSummary = async (req, res) => {
  try {
    const userId = req.body.userId;

    const user = await userModel.findOne({ _id: userId });
    if (!user) return res.json({ success: false, message: "User not found" });

    if (user.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Seller privileges required."
      });
    }

    const seller = await sellerModel.findOne({ userID: user.userID });
    if (!seller) {
      return res.json({ success: false, message: "Seller profile not found." });
    }

    // Get order summary by status
    const summary = await orderModel.aggregate([
      {
        $match: { "items.sellerID": seller.sellerID }
      },
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const statusCounts = {
      pending: 0,
      preparing: 0,
      shipping: 0,
      completed: 0,
      canceled: 0
    };

    summary.forEach(item => {
      statusCounts[item._id] = item.count;
    });

    res.json({
      success: true,
      data: statusCounts
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching order summary." });
  }
};

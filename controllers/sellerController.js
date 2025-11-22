// controllers/sellerController.js
import sellerModel from "../models/sellerModel.js";
import foodModel from "../models/foodModel.js";
import ratingModel from "../models/ratingModel.js";
import userModel from "../models/userModel.js";

// Get seller detail (including foods + average rating)
export const getSellerDetail = async (req, res) => {
  try {
    const { sellerID } = req.params;

    const seller = await sellerModel.findOne({ sellerID });
    if (!seller) {
      return res.json({ success: false, message: "Seller not found." });
    }

    // Get all foods by seller
    const foods = await foodModel.find({ sellerID }).select("foodID foodName price foodImage category");

    // Extract all foodIDs to calculate rating
    const foodIDs = foods.map((f) => f.foodID);

    let avgRating = 0;
    let totalReviews = 0;

    if (foodIDs.length > 0) {
  const ratingSummary = await ratingModel.aggregate([
        { $match: { foodID: { $in: foodIDs } } },
        {
          $group: {
            _id: null,
            avgRating: { $avg: "$rating" },
            totalReviews: { $sum: 1 }
          }
        }
      ]);

      if (ratingSummary.length > 0) {
        avgRating = ratingSummary[0].avgRating;
        totalReviews = ratingSummary[0].totalReviews;
      }
    }

    res.json({
      success: true,
      data: {
        sellerInfo: seller,
        foods,
        avgRating,
        totalReviews
      }
    });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching seller detail." });
  }
};

// List all sellers (with basic info)
export const listSellers = async (req, res) => {
  try {
    const sellers = await sellerModel.find({});
    res.json({ success: true, data: sellers });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching seller list." });
  }
};

// Update seller store info
export const updateSellerInfo = async (req, res) => {
  try {
    const { storeName, storeDescription, storeAddress, storeImage, categories, openTime, closeTime } = req.body;
    const userId = req.body.userId; // from auth middleware

    // Get user's userID from the database
    const user = await userModel.findOne({ _id: userId });
    if (!user) return res.json({ success: false, message: "User not found" });
    const userID = user.userID;

    const seller = await sellerModel.findOne({ userID });
    if (!seller) {
      return res.json({ success: false, message: "Seller not found." });
    }

    // Validate time format if provided (hh:mm 24-hour format)
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (openTime !== undefined && !timeRegex.test(openTime)) {
      return res.json({ success: false, message: "openTime must be in hh:mm format (24-hour), e.g., 08:30 or 14:00" });
    }
    if (closeTime !== undefined && !timeRegex.test(closeTime)) {
      return res.json({ success: false, message: "closeTime must be in hh:mm format (24-hour), e.g., 20:00 or 22:30" });
    }

    // Note: sellerID and userID are system-managed and cannot be changed
    if (storeName !== undefined) seller.storeName = storeName; // Can have spaces, can duplicate
    if (storeDescription !== undefined) seller.storeDescription = storeDescription;
    if (storeAddress !== undefined) seller.storeAddress = storeAddress;
    if (storeImage !== undefined) seller.storeImage = storeImage;
    if (categories !== undefined) seller.categories = categories;
    if (openTime !== undefined) seller.openTime = openTime;
    if (closeTime !== undefined) seller.closeTime = closeTime;

    await seller.save();

    res.json({ success: true, message: "Seller info updated.", data: seller });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error updating seller info." });
  }
};

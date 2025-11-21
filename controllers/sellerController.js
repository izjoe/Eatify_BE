// controllers/sellerController.js
import sellerModel from "../models/sellerModel.js";
import foodModel from "../models/foodModel.js";
import foodRatingModel from "../models/foodRatingModel.js";

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
      const ratingSummary = await foodRatingModel.aggregate([
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
    const { userID, storeName, storeDescription, storeAddress, storeImage, categories } = req.body;

    const seller = await sellerModel.findOne({ userID });
    if (!seller) {
      return res.json({ success: false, message: "Seller not found." });
    }

    if (storeName) seller.storeName = storeName;
    if (storeDescription) seller.storeDescription = storeDescription;
    if (storeAddress) seller.storeAddress = storeAddress;
    if (storeImage) seller.storeImage = storeImage;
    if (categories) seller.categories = categories;

    await seller.save();

    res.json({ success: true, message: "Seller info updated.", data: seller });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error updating seller info." });
  }
};

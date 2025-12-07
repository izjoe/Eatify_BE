import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    foodID: { type: String, required: true, unique: true },
    sellerID: { type: String, required: true }, // Reference to seller/restaurant
    foodName: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    foodImage: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    isAvailable: { type: Boolean, default: true },
    // Calculated rating fields (updated when reviews are added)
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
  },
  { 
    timestamps: true // Auto add createdAt & updatedAt
  }
);

// Prevent model recompilation in development
const foodModel = mongoose.models.food || mongoose.model("food", foodSchema);

export default foodModel;
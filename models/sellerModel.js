import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    sellerID: { type: String, required: true, unique: true },
    userID: { type: String, required: true },
    storeName: { type: String, required: true },
    storeDescription: { type: String },
    storeAddress: { type: String, required: true },
    storeImage: { type: String },
    categories: { type: [String], required: true },
    openTime: { type: String, match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'openTime must be in hh:mm format (24-hour)'] },
    closeTime: { type: String, match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'closeTime must be in hh:mm format (24-hour)'] },
    isActive: { type: Boolean, default: true },
    // Business & Financial Fields
    bankAccountNumber: { type: String },
    bankName: { type: String },
    taxID: { type: String },
    commissionPercentage: { type: Number, default: 15, min: 0, max: 100 },
    deliveryZone: { type: String },
    minimumOrderAmount: { type: Number, default: 0 },
    cuisineTypes: [String],
    // Analytics Fields
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    verificationStatus: { 
      type: String, 
      enum: ['pending', 'verified', 'rejected'], 
      default: 'pending' 
    }
  },
  { timestamps: true }
);

const sellerModel =
  mongoose.models.seller || mongoose.model("seller", sellerSchema);

export default sellerModel;

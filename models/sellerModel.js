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
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const sellerModel =
  mongoose.models.seller || mongoose.model("seller", sellerSchema);

export default sellerModel;

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
    openTime: { type: String },
    closeTime: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const sellerModel =
  mongoose.models.seller || mongoose.model("seller", sellerSchema);

export default sellerModel;

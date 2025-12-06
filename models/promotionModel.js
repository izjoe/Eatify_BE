import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema(
  {
    promotionID: { type: String, required: true, unique: true },
    sellerID: { type: String, required: true },
    promotionTitle: { type: String, required: true },
    discountCode: { type: String, required: true, unique: true },
    discountType: { 
      type: String, 
      enum: ['percentage', 'fixed'], 
      required: true 
    },
    discountValue: { type: Number, required: true, min: 0 },
    minOrderAmount: { type: Number, default: 0 },
    maxUsage: { type: Number, default: null }, // null = unlimited
    usageCount: { type: Number, default: 0 },
    expiryDate: { type: Date, required: true },
    status: { 
      type: String, 
      enum: ['active', 'expired', 'paused'], 
      default: 'active' 
    },
    description: { type: String },
    applicableCategories: [String], // Empty array = all categories
    maxDiscountAmount: { type: Number, default: null } // For percentage discounts
  },
  { timestamps: true }
);

// Auto-expire promotions
promotionSchema.pre("save", function (next) {
  if (this.expiryDate < new Date() && this.status !== 'expired') {
    this.status = 'expired';
  }
  next();
});

const promotionModel =
  mongoose.models.promotion || mongoose.model("promotion", promotionSchema);

export default promotionModel;

import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  foodID: { type: String, required: true },
  foodName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema(
  {
    orderID: { type: String, required: true, unique: true },
    userID: { type: String, required: true },
    items: [orderItemSchema],
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    orderStatus: {
      type: String,
      enum: ["pending", "preparing", "shipping", "completed", "canceled"],
      default: "pending"
    },
    note: { type: String }
  },
  { timestamps: true }
);

// Auto-change orderStatus if payment is completed
orderSchema.pre("save", function (next) {
  if (this.isPaid && this.orderStatus === "pending") {
    this.orderStatus = "preparing";
  }
  next();
});

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;

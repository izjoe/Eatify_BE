import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderID: { type: String, required: true, unique: true },
    userID: { type: String, required: true },
    items: [
      {
        foodID: { type: String, required: true },
        foodName: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        subtotal: { type: Number, required: true },
      }
    ],
    totalPrice: { type: Number, required: true },
    deliveryAddress: { type: String, required: true },
    phone: { type: String, required: true },
    payment: { type: Boolean, required: true, default: false },
    status: { type: String, required: true, enum: ["pending", "preparing", "shipping", "completed", "cancelled"], default: "pending" },
    note: { type: String },
  },
  { timestamps: true }
);

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  foodID: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 }
});

const cartSchema = new mongoose.Schema(
  {
    userID: { type: String, required: true, unique: true },
    items: [cartItemSchema]
  },
  { timestamps: true }
);

const cartModel =
  mongoose.models.cart || mongoose.model("cart", cartSchema);

export default cartModel;

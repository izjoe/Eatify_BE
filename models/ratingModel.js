import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    ratingID: { type: String, required: true, unique: true },
    userID: { type: String, required: true },
    foodID: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String }
  },
  { timestamps: true }
);

const ratingModel =
  mongoose.models.rating || mongoose.model("rating", ratingSchema);

export default ratingModel;

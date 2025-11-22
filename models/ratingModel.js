import mongoose from "mongoose";

const foodRatingSchema = new mongoose.Schema(
  {
    ratingID: { type: String, required: true, unique: true },

    userID: { type: String, required: true },
    foodID: { type: String, required: true },

    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String }
  },
  { timestamps: true }
);

const foodRatingModel =
  mongoose.models.foodrating || mongoose.model("foodrating", foodRatingSchema);

export default foodRatingModel;

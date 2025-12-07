import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    ratingID: { type: String, required: true, unique: true },
    userID: { type: String, required: true },
    foodID: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    // Store user info snapshot for display (denormalized for performance)
    userName: { type: String },
    userAvatar: { type: String }
  },
  { timestamps: true }
);

// Index for faster queries
ratingSchema.index({ foodID: 1, createdAt: -1 });
ratingSchema.index({ userID: 1, foodID: 1 });

const ratingModel =
  mongoose.models.rating || mongoose.model("rating", ratingSchema);

export default ratingModel;

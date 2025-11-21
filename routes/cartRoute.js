import express from "express";
import {
  addToCart,
  removeFromCart,
  getCart,
} from "../controllers/cartController.js";
import authMiddleware from "../middleware/auth.js";

const cartRouter = express.Router();

// Add item to cart
cartRouter.post("/add", authMiddleware, addToCart);

// Remove item from cart
cartRouter.post("/remove", authMiddleware, removeFromCart);

// Get user's cart
cartRouter.post("/get", authMiddleware, getCart);

export default cartRouter;

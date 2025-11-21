// routes/sellerRoute.js
import express from "express";
import auth from "../middleware/auth.js";
import {
  getSellerDetail,
  listSellers,
  updateSellerInfo
} from "../controllers/sellerController.js";

const sellerRouter = express.Router();

// Public: view a single seller (with foods + average rating)
sellerRouter.get("/:sellerID", getSellerDetail);

// Public: list all sellers
sellerRouter.get("/", listSellers);

// Seller-only: update store info
sellerRouter.put("/update", auth, updateSellerInfo);

export default sellerRouter;

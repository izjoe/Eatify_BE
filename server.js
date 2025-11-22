// server.js
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import ratingRouter from "./routes/ratingRoute.js";

// Load environment variables first
import * as dotenv from 'dotenv'; 
dotenv.config();

// app config
const app = express();
const port = process.env.PORT || 4000;

// middlewares
app.use(express.json());
app.use(cors());

// DB connection
connectDB();

// API endpoints
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/rating", ratingRouter);

// Static files
app.use("/images", express.static("uploads"));

// Root endpoint
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

// mongodb+srv://23521031_db_user:vDcHMDognC7DbcHZ@cluster0.eeujscv.mongodb.net/?appName=Cluster0

// hatecode --- LmhO4lYrdWvZ8T1H

// mongodb+srv://23521031_db_user:LmhO4lYrdWvZ8T1H@cluster0.eeujscv.mongodb.net/test?appName=Cluster0

// admin01 --- h4y0qyRz8lP1fOs0
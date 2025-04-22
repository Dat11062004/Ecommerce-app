import express from "express";
import {
  placeOrder,
  placeOrderStripe,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";

import authUser from "../middleware/auth.js";
const orderRoute = express.Router();
// Admin Features
orderRoute.post("/list", adminAuth, allOrders);
orderRoute.post("/status", adminAuth, updateStatus);
// Payment Features
orderRoute.post("/place", authUser, placeOrder);
orderRoute.post("/stripe", authUser, placeOrderStripe);

// User Feature
orderRoute.post("/userorders", authUser, userOrders);
// Verify payment
orderRoute.post("/verifyStripe", authUser, verifyStripe);
export default orderRoute;

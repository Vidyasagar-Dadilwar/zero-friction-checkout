import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import { createPayment, paymentWebhook } from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create", authMiddleware, createPayment);
router.post("/webhook", paymentWebhook);

export default router;

import express from "express";
import { getActiveCart, addItemToCart, lockCart } from "../controllers/cart.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/active", getActiveCart);
router.post("/item", addItemToCart);
router.post("/lock", lockCart);

export default router;
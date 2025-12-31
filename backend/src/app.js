import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import authMiddleware from "./middleware/auth.middleware.js";
import cartRoutes from "./routes/cart.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import exitRoutes from "./routes/exit.routes.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes)
app.use("/cart", cartRoutes);
app.use("/payment", paymentRoutes);
app.use("/exit", exitRoutes);



export default app;
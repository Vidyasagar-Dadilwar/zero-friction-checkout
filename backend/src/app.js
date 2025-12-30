import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import authMiddleware from "./middleware/auth.middleware.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRoutes)


app.get("/protected", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});


app.get("/health", (req, res) => {
    res.json({
        status: "OK"
    });
})

export default app;
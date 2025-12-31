import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import { verifyExitToken } from "../controllers/exit.controller.js";

const router = express.Router();

router.post(
  "/verify",
  authMiddleware,
  roleMiddleware(["GUARD"]),
  verifyExitToken
);

export default router;
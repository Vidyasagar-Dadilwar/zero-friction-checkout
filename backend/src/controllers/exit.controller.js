import ExitToken from "../models/ExitToken.js";

export const verifyExitToken = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "Token required" });
  }

  const exitToken = await ExitToken.findOne({ token });

  if (!exitToken) {
    return res.status(404).json({ message: "Invalid token" });
  }

  if (exitToken.used) {
    return res.status(400).json({ message: "Token already used" });
  }

  if (exitToken.expiresAt < new Date()) {
    return res.status(400).json({ message: "Token expired" });
  }

  exitToken.used = true;
  await exitToken.save();

  return res.json({
    message: "Exit allowed",
    cartId: exitToken.cartId
  });
};
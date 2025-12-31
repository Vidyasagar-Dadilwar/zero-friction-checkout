import Cart from "../models/Cart.js";
import Payment from "../models/Payment.js";
import ExitToken from "../models/ExitToken.js";
import { generateExitToken } from "../utils/exitToken.js";

const createPayment = async (req, res) => {
  const userId = req.user.userId;

  const cart = await Cart.findOne({
    userId,
    status: { $in: ["LOCKED", "PAID"] }
  });

  if (!cart) {
    return res.status(400).json({ message: "No cart ready for payment" });
  }

  if (cart.status === "PAID") {
    return res.status(400).json({ message: "Cart already paid" });
  }

  const existingPayment = await Payment.findOne({
    cartId: cart._id,
    status: { $in: ["PENDING", "SUCCESS"] }
  });

  if (existingPayment) {
    return res.json(existingPayment);
  }

  const payment = await Payment.create({
    cartId: cart._id,
    provider: "MOCK",
    paymentId: `mock_${Date.now()}`,
    amount: cart.totalAmount,
    status: "PENDING"
  });

  res.json(payment);
};



const paymentWebhook = async (req, res) => {
    const { paymentId, status } = req.body;

    const payment = await Payment.findOne({paymentId});

    if(!payment){
        return res.status(404).json({message: "Payment not found"});
    }

    if(payment.status === "SUCCESS"){
        return res.json({message: "Already processed"});
    }

    if(status !== "SUCCESS"){
        payment.status = "FAILED";
        await payment.save();
        return res.json({message: "Payment failed"});
    }

    payment.status = "SUCCESS";
    payment.verified = true;
    await payment.save();

    const cart = await Cart.findOneAndUpdate(
        { _id: payment.cartId, status: "LOCKED" },
        { status: "PAID" },
        { new: true }
    );

    if(!cart){
        return res.json({message: "Cart already processed"});
    }
    const existingToken = await ExitToken.findOne({cartId: cart._id});

    if(!existingToken){
        await ExitToken.create({
            cartId: cart._id,
            token: generateExitToken(),
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });
    }

    res.json({message: "Payment processed successfully"});
}


export { createPayment, paymentWebhook };
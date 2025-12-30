import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
        required: true
    },
    provider: {
        type: String, 
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["PENDING", "SUCCESS", "FAILED"],
        default: "PENDING"
    },
    verified: {
        type: Boolean, 
        default: false
    }
}, {timestamps: true});

paymentSchema.index({ paymentId: 1 }, { unique: true });

const PaymentSchema = mongoose.model("Payment", paymentSchema);
export default PaymentSchema;

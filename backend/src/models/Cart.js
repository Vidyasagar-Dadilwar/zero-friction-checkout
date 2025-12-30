import mongoose, { mongo } from "mongoose";

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    qty: {
        type: Number,
        required: true,
        default: 1
    },
    priceSnapshot: {
        type: Number,
        required: true
    }
}, {_id: false});



const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true 
    },
    items: {
        type: [cartItemSchema],
        default: []
    },
    totalAmount: {
        type: Number, 
        default: 0
    },
    status: {
        type: String, 
        enum: ["ACTIVE", "LOCK", "PAID", "EXPIRED"],
        default: "ACTIVE"
    },
    lockedAt: Date,
    expiresAt: Date,
}, {timestamps: true});


// TTL index -> Auto cleanup

cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const CartSchema = mongoose.model("Cart", cartSchema);
export default CartSchema;
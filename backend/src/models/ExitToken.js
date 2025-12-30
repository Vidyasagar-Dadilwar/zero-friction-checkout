import mongoose from "mongoose";

const exitTokenSchema = new mongoose.Schema({
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true 
  },
  used: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {timestamps: true});

exitTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const ExitTokenSchema = mongoose.model("ExitToken", exitTokenSchema);

export default ExitTokenSchema;
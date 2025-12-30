import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true 
    },
    phone: {
        type: String, 
        required: true,
        unique: true 
    },
    role: {
        type: String, 
        enum: ["USER", "ADMIN", "GUARD"],
        default: "USER"
    }
},{timestamps: true})

const UserSchema = mongoose.model("User", userSchema);
export default UserSchema;
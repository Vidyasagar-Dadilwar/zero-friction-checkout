import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true
    },
    barcode: {
        type: String, 
        required: true,
        unique: true
    },
    price: {
        type: Number, 
        required: true
    },
    stock: {
        type: Number, 
        required: true
    },
    active: {
        type: Boolean, 
        default: true
    },
}, {timestamps: true});

const ProductSchema = mongoose.model("Product", productSchema);
export default ProductSchema;
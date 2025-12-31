import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

const getActiveCart = async (req, res) => {
    const userId = req.user.userId;
    
    // 1. First, try to find ACTIVE cart
let cart = await Cart.findOne({
  userId,
  status: "ACTIVE"
});

if (cart) {
  return res.json(cart);
}

// 2. If no ACTIVE cart, create a new one
cart = await Cart.create({
  userId,
  items: [],
  totalAmount: 0,
  expiresAt: new Date(Date.now() + 30 * 60 * 1000)
});

return res.json(cart);

}

const addItemToCart = async (req, res) => {
    const userId = req.user.userId;
    const { barcode, qty } = req.body;

    if(qty <= 0){
        return res.status(400).json({message: "Quantity must be greater than 0"});
    }

    const product = await Product.findOne({
        barcode, 
        active: true 
    })

    if(!product){
        return res.status(404).json({message: "Product not found"});
    }

    let cart = await Cart.findOne({userId, status: "ACTIVE"});

    if(!cart){
        return res.status(404).json({message: "Cart not found any active cart"});
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === product._id.toString());

    if(itemIndex >= 0){
        cart.items[itemIndex].qty = qty;
    }
    else{
        cart.items.push({
            productId: product._id,
            qty, 
            priceSnapshot: product.price
        });
    }

    cart.totalAmount = cart.items.reduce((sum, i) => sum + i.qty * i.priceSnapshot, 0);

    await cart.save();
    res.status(200).json(cart);
}


const lockCart = async (req, res) => {
    const userId = req.user.userId;

    let cart = await Cart.findOneAndUpdate(
        {userId, status: "ACTIVE"},
        {
            status: "LOCKED",
            lockedAt: new Date(),
            expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
        {new: true}
    );

    if(!cart){
        return res.status(404).json({message: "No active cart to lock"});
    }

    res.status(200).json(cart);
}

export { getActiveCart, addItemToCart, lockCart };
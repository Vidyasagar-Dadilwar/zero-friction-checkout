import { signToken } from "../utils/jwt.js";
import User from "../models/User.js";

const login = async (req, res) => {
    const { phone, otp } = req.body;

    // to be implemented
    if(otp != "123456"){
        return res.status(400).json({message: "Invalid OTP"});
    }

    let user = await User.findOne({phone});

    if(!user){
        user = await User.create({
            phone,
            name: "Guest User"
        })
    };

    const token = signToken({
        userId: user._id, 
        role: user.role 
    });

    res.cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
    })
    .json({
        message: "Logged in",
    });
};


const logout = (req, res) => {
    res.clearCookie("token").json({message: "Logged out"});
};


export { login, logout };
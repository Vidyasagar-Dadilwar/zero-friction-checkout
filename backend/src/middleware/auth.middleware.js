import { verifyToken } from "../utils/jwt.js";

const authMiddleware = (req, res, next) => {
    const token = req.cookies?.token;

    if(!token){
        return res.status(401).json({message: "Unauthorized"});
    }

    try {
        const decoded = verifyToken(token); 
        req.user = {
            userId: decoded.userId,
            role: decoded.role
        };
        next();        
    } catch (error) {
        return res.status(401).json({message: "Invalid token"})
    }
}

export default authMiddleware;
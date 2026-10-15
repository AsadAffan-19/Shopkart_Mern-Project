import jwt from "jsonwebtoken";
import Customer from "../models/customer.model.js";

const isAuthenticated = async (req, res, next) => {
    try {
        let token = req.cookies?.token;

        // Also allow Bearer token in header for API/Postman testing
        if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized: No token provided" });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "shopkart_jwt_secret_key_2026_super_secure"
        );

        const customer = await Customer.findById(decoded.userId).select("-password");

        if (!customer) {
            return res.status(401).json({ success: false, message: "Unauthorized: Customer not found" });
        }

        req.user = customer;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: "Unauthorized: Invalid or expired token" });
    }
};

export default isAuthenticated;

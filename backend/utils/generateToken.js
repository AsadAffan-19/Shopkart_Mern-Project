import jwt from "jsonwebtoken";

const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET || "shopkart_jwt_secret_key_2026_super_secure",
        { expiresIn: "7d" }
    );
};

export default generateToken;

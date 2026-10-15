import express from "express";
import {
    addToWishlist,
    getWishlist,
    removeFromWishlist
} from "../controllers/wishlist.controller.js";
import isAuthenticated from "../middlewares/auth.middleware.js";

const wishlistRoutes = express.Router();

wishlistRoutes.use(isAuthenticated);

wishlistRoutes.post("/:productId", addToWishlist);
wishlistRoutes.get("/", getWishlist);
wishlistRoutes.delete("/:productId", removeFromWishlist);

export default wishlistRoutes;

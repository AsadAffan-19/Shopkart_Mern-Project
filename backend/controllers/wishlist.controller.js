import mongoose from "mongoose";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";

// Task 2: Add Product to Wishlist (POST /wishlist/:productId)
export const addToWishlist = async (req, res, next) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        const customer = await Customer.findById(req.user._id);

        // Check if already in wishlist
        const alreadyInWishlist = customer.wishlist.some(
            (id) => id.toString() === productId
        );

        if (alreadyInWishlist) {
            return res.status(409).json({
                success: false,
                message: "Product already in wishlist"
            });
        }

        customer.wishlist.push(productId);
        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Product added to wishlist"
        });
    } catch (err) {
        next(err);
    }
};

// Task 3: Get Current User's Wishlist (GET /wishlist)
export const getWishlist = async (req, res, next) => {
    try {
        const customer = await Customer.findById(req.user._id).populate({
            path: "wishlist",
            select: "name price category image stock rating reviewsCount description"
        });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        return res.status(200).json({
            success: true,
            count: customer.wishlist.length,
            wishlist: customer.wishlist
        });
    } catch (err) {
        next(err);
    }
};

// Task 4: Remove Product from Wishlist (DELETE /wishlist/:productId)
export const removeFromWishlist = async (req, res, next) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const customer = await Customer.findById(req.user._id);

        const existsInWishlist = customer.wishlist.some(
            (id) => id.toString() === productId
        );

        if (!existsInWishlist) {
            return res.status(404).json({
                success: false,
                message: "Product not found in wishlist"
            });
        }

        customer.wishlist = customer.wishlist.filter(
            (id) => id.toString() !== productId
        );

        await customer.save();

        return res.status(200).json({
            success: true,
            message: "Product removed from wishlist"
        });
    } catch (err) {
        next(err);
    }
};

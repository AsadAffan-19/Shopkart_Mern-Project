import mongoose from "mongoose";
import Customer from "../models/customer.model.js";
import Product from "../models/product.model.js";

// Task 2: Add Product to Cart API (POST /cart/:productId)
export const addToCart = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const requestedQuantity = req.body?.quantity ? Math.max(1, parseInt(req.body.quantity)) : 1;

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

        const existingCartItem = customer.cart.find(
            (item) => item.product.toString() === productId
        );

        const newQuantity = existingCartItem
            ? existingCartItem.quantity + requestedQuantity
            : requestedQuantity;

        // Stock validation
        if (newQuantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: `Insufficient stock. Only ${product.stock} units available.`
            });
        }

        if (existingCartItem) {
            existingCartItem.quantity = newQuantity;
        } else {
            customer.cart.push({
                product: productId,
                quantity: newQuantity
            });
        }

        await customer.save();

        const updatedCustomer = await Customer.findById(req.user._id).populate({
            path: "cart.product",
            select: "name price category image stock"
        });

        return res.status(200).json({
            success: true,
            message: "Cart updated",
            cart: updatedCustomer.cart
        });
    } catch (err) {
        next(err);
    }
};

// Task 3: Get Current User's Cart (GET /cart)
export const getCart = async (req, res, next) => {
    try {
        const customer = await Customer.findById(req.user._id).populate({
            path: "cart.product",
            select: "name price category image stock"
        });

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        return res.status(200).json({
            success: true,
            count: customer.cart.length,
            cart: customer.cart
        });
    } catch (err) {
        next(err);
    }
};

// Task 4: Update Product Quantity (PATCH /cart/:productId)
export const updateCartQuantity = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const numQuantity = Number(quantity);
        if (isNaN(numQuantity) || numQuantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be a valid number of at least 1"
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (numQuantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: `Requested quantity exceeds available stock (${product.stock})`
            });
        }

        const customer = await Customer.findById(req.user._id);
        const item = customer.cart.find((i) => i.product.toString() === productId);

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Product not in cart"
            });
        }

        item.quantity = numQuantity;
        await customer.save();

        const updatedCustomer = await Customer.findById(req.user._id).populate({
            path: "cart.product",
            select: "name price category image stock"
        });

        return res.status(200).json({
            success: true,
            message: "Cart quantity updated",
            cart: updatedCustomer.cart
        });
    } catch (err) {
        next(err);
    }
};

// Task 5: Remove Product from Cart (DELETE /cart/:productId)
export const removeFromCart = async (req, res, next) => {
    try {
        const { productId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const customer = await Customer.findById(req.user._id);
        const initialLength = customer.cart.length;

        customer.cart = customer.cart.filter(
            (item) => item.product.toString() !== productId
        );

        if (customer.cart.length === initialLength) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });
        }

        await customer.save();

        const updatedCustomer = await Customer.findById(req.user._id).populate({
            path: "cart.product",
            select: "name price category image stock"
        });

        return res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart: updatedCustomer.cart
        });
    } catch (err) {
        next(err);
    }
};

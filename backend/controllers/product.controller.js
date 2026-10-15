import mongoose from "mongoose";
import Product from "../models/product.model.js";

// Task 2: Create Product API (POST /products)
export const createProduct = async (req, res, next) => {
    try {
        const { name, description, price, category, image, stock, rating, reviewsCount } = req.body;

        if (!name || !description || price === undefined || !category || !image || stock === undefined) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: name, description, price, category, image, stock"
            });
        }

        const numPrice = Number(price);
        const numStock = Number(stock);

        if (isNaN(numPrice) || numPrice <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid price: Price must be greater than 0"
            });
        }

        if (isNaN(numStock) || numStock < 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid stock: Stock cannot be negative"
            });
        }

        const product = await Product.create({
            name: name.trim(),
            description: description.trim(),
            price: numPrice,
            category: category.trim(),
            image: image.trim(),
            stock: numStock,
            rating: rating ? Number(rating) : 4.8,
            reviewsCount: reviewsCount ? Number(reviewsCount) : 85
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });
    } catch (err) {
        next(err);
    }
};

// Task 3 & 5: Get All Products with Search, Category Filter, and Sorting (GET /products)
export const getAllProducts = async (req, res, next) => {
    try {
        const { search, category, sort, minPrice, maxPrice } = req.query;

        const query = {};

        // Case-insensitive name search
        if (search && search.trim()) {
            query.name = { $regex: search.trim(), $options: "i" };
        }

        // Category filter
        if (category && category.trim() && category.trim().toLowerCase() !== "all") {
            query.category = { $regex: new RegExp(`^${category.trim()}$`, "i") };
        }

        // Price range filtering
        if (minPrice !== undefined || maxPrice !== undefined) {
            query.price = {};
            if (minPrice !== undefined && !isNaN(Number(minPrice))) {
                query.price.$gte = Number(minPrice);
            }
            if (maxPrice !== undefined && !isNaN(Number(maxPrice))) {
                query.price.$lte = Number(maxPrice);
            }
        }

        let sortOption = { createdAt: -1 }; // default latest

        if (sort === "price_asc") {
            sortOption = { price: 1 };
        } else if (sort === "price_desc") {
            sortOption = { price: -1 };
        } else if (sort === "name_asc") {
            sortOption = { name: 1 };
        }

        const products = await Product.find(query).sort(sortOption);

        return res.status(200).json({
            success: true,
            count: products.length,
            products
        });
    } catch (err) {
        next(err);
    }
};

// Task 4: Get Single Product API (GET /products/:id)
export const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            product
        });
    } catch (err) {
        next(err);
    }
};

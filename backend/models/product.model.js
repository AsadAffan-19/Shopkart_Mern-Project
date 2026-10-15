import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true
        },
        description: {
            type: String,
            required: [true, "Product description is required"],
            trim: true
        },
        price: {
            type: Number,
            required: [true, "Product price is required"],
            min: [1, "Price must be greater than 0"]
        },
        category: {
            type: String,
            required: [true, "Product category is required"],
            trim: true
        },
        image: {
            type: String,
            required: [true, "Product image URL is required"],
            trim: true
        },
        stock: {
            type: Number,
            required: [true, "Product stock is required"],
            min: [0, "Stock cannot be negative"]
        },
        rating: {
            type: Number,
            default: 4.8,
            min: 0,
            max: 5
        },
        reviewsCount: {
            type: Number,
            default: 85
        }
    },
    {
        timestamps: true
    }
);

const Product = mongoose.model("Product", productSchema);

export default Product;

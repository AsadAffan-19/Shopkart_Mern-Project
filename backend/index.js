import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { MongoMemoryServer } from "mongodb-memory-server";

import customerRoutes from "./routes/customer.routes.js";
import productRoutes from "./routes/product.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import { seedDatabase } from "./seed.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.join(__dirname, ".env")
});

const app = express();
const port = process.env.PORT || 8080;

// Connect to MongoDB (Atlas with automatic local in-memory fallback for instant dev/testing)
async function connectDatabase() {
    if (process.env.TEST_MODE || process.env.NODE_ENV === "test" || process.argv[1]?.includes("test")) return;

    let connected = false;
    if (process.env.dbURL && !process.env.dbURL.includes("cluster0.mongodb.net")) {
        try {
            await mongoose.connect(process.env.dbURL, { serverSelectionTimeoutMS: 5000 });
            console.log("✅ DB Connected successfully to MongoDB Atlas");
            connected = true;
            await seedDatabase();
        } catch (err) {
            console.warn("MongoDB Atlas connection notice:", err.message);
        }
    }

    if (!connected) {
        try {
            console.log("🔄 Starting local developer database...");
            const mongod = await MongoMemoryServer.create();
            await mongoose.connect(mongod.getUri());
            console.log("✅ Developer Database online at", mongod.getUri());
            await seedDatabase();
        } catch (memErr) {
            console.error("Local DB startup error:", memErr.message);
        }
    }
}

connectDatabase();

// Middlewares
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin) || origin.startsWith("http://localhost:")) {
            callback(null, true);
        } else {
            callback(null, true);
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Mount Routes for all Labs (01 - 06)
app.use("/customers", customerRoutes);
app.use("/products", productRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

// Error Handling Middleware
app.use(errorMiddleware);

let server;
if (process.env.NODE_ENV !== "test" && !process.argv[1]?.includes("test")) {
    server = app.listen(port, "0.0.0.0", () => {
        console.log(`🛍️ ShopKart Backend Server Started at port ${port}`);
    });
}

export { app, server };
export default app;

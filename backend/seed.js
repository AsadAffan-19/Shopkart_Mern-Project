import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/product.model.js";

dotenv.config();

const sampleProducts = [
  {
    name: "Wireless Game Controller",
    description: "Ergonomic dual-vibration wireless gamepad compatible with PC, consoles, and mobile devices.",
    price: 1899,
    category: "Gaming",
    image: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=500&q=80",
    stock: 15,
    rating: 5.0,
    reviewsCount: 185
  },
  {
    name: "RGB Mechanical Keyboard",
    description: "Customizable per-key RGB backlighting with tactile blue mechanical switches and aluminum top frame.",
    price: 2999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80",
    stock: 20,
    rating: 4.9,
    reviewsCount: 312
  },
  {
    name: "HD Webcam 1080P Pro",
    description: "Full HD 1080p 60fps streaming webcam with auto-focus and dual noise-cancelling microphones.",
    price: 1499,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=500&q=80",
    stock: 25,
    rating: 4.8,
    reviewsCount: 94
  },
  {
    name: "2.1 Audio Speaker System",
    description: "Deep bass subwoofer with clear satellite speakers delivering room-filling 80W peak power.",
    price: 4999,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&q=80",
    stock: 10,
    rating: 4.7,
    reviewsCount: 68
  },
  {
    name: "Smart Bluetooth Speaker",
    description: "360-degree surround sound with built-in voice assistant, waterproof IPX7 rating and 16-hour playtime.",
    price: 2499,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=500&q=80",
    stock: 30,
    rating: 4.9,
    reviewsCount: 220
  },
  {
    name: "Ergonomic Optical Mouse",
    description: "Vertical ergonomic wireless mouse engineered to reduce wrist strain and muscle tension.",
    price: 999,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&q=80",
    stock: 40,
    rating: 4.8,
    reviewsCount: 145
  },
  {
    name: "Wireless Gaming Headset",
    description: "Spatial 7.1 surround sound with ultra-low latency 2.4GHz wireless connection and memory foam earcups.",
    price: 3499,
    category: "Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80",
    stock: 18,
    rating: 4.9,
    reviewsCount: 198
  },
  {
    name: "Wireless Gamepad Elite",
    description: "Precision analog triggers, swappable thumbsticks and textured rubber grips for tournament play.",
    price: 2199,
    category: "Gaming",
    image: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=500&q=80",
    stock: 12,
    rating: 5.0,
    reviewsCount: 88
  },
  {
    name: "Ultra-Slim OLED Laptop 16GB",
    description: "14-inch 2.8K 120Hz OLED display powered by next-gen processor, 16GB LPDDR5 RAM and 1TB SSD.",
    price: 64999,
    category: "Laptops",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80",
    stock: 8,
    rating: 4.9,
    reviewsCount: 42
  },
  {
    name: "Smart Fitness Watch Ultra",
    description: "AMOLED always-on display, comprehensive health sensors, heart rate & SpO2 tracking, 7-day battery.",
    price: 4299,
    category: "Wearables",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
    stock: 22,
    rating: 4.7,
    reviewsCount: 115
  },
  {
    name: "Next-Gen Smartphone 256GB",
    description: "Pro-grade 50MP triple camera system, Snapdragon flagship processor and 120Hz smooth AMOLED display.",
    price: 42999,
    category: "Mobile",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80",
    stock: 14,
    rating: 4.8,
    reviewsCount: 260
  },
  {
    name: "Noise Cancelling Headphones",
    description: "Active noise cancellation with transparent ambient mode, hi-res audio certification and 30h battery.",
    price: 6499,
    category: "Audio",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500&q=80",
    stock: 16,
    rating: 5.0,
    reviewsCount: 310
  }
];

export const seedDatabase = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(sampleProducts);
      console.log(`✅ Seeded ${sampleProducts.length} default products`);
    } else {
      console.log(`ℹ️ Products collection already has ${count} items`);
    }
  } catch (err) {
    console.error("Seed error:", err.message);
  }
};

if (process.argv[1] && process.argv[1].endsWith("seed.js")) {
  mongoose.connect(process.env.dbURL)
    .then(async () => {
      await seedDatabase();
      await mongoose.disconnect();
    })
    .catch((err) => console.error("DB connection error:", err.message));
}

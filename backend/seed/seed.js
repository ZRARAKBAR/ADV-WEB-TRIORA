import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

const tree = [
  ["newborn", "unisex", ["Baby Clothing", "Rompers", "Bodysuits", "Sleepsuits", "Baby Sets", "Baby Shoes", "Baby Accessories"]],
  ["kids", "boys", ["T-Shirts", "Shirts", "Hoodies", "Sweatshirts", "Jackets", "Jeans", "Trousers", "Shorts", "Tracksuits", "Shoes"]],
  ["kids", "girls", ["Dresses", "Tops", "T-Shirts", "Hoodies", "Jackets", "Jeans", "Skirts", "Leggings", "Shoes"]],
  ["teen", "boys", ["Oversized T-Shirts", "Graphic T-Shirts", "Shirts", "Hoodies", "Sweatshirts", "Varsity Jackets", "Jeans", "Cargo Pants", "Shorts", "Sneakers"]],
  ["teen", "girls", ["Dresses", "Oversized T-Shirts", "Crop Tops", "Hoodies", "Jackets", "Jeans", "Wide-Leg Pants", "Skirts", "Co-ord Sets", "Sneakers"]],
  ["adult", "men", ["T-Shirts", "Polo Shirts", "Casual Shirts", "Formal Shirts", "Hoodies", "Sweatshirts", "Jackets", "Blazers", "Jeans", "Cargo Pants", "Chinos", "Trousers", "Shorts"]],
  ["adult", "women", ["Dresses", "Tops", "T-Shirts", "Hoodies", "Jackets", "Blazers", "Jeans", "Wide-Leg Pants", "Trousers", "Skirts", "Activewear", "Abayas", "Co-ord Sets"]],
  ["accessories", "unisex", ["Bags", "Caps", "Belts", "Wallets", "Socks", "Watches", "Sunglasses", "Scarves"]],
];

const slugify = (s) => s.toLowerCase().trim().replace(/\s+/g, "-");

await mongoose.connect(process.env.MONGODB_URI);
console.log("Connected, seeding...");

await Category.deleteMany();
await Category.insertMany(
  tree.flatMap(([ageGroup, gender, names]) =>
    names.map((name) => ({ name, slug: slugify(name), ageGroup, gender }))
  )
);

await Product.deleteMany();
await Product.insertMany([
  { name: "Oversized Graphic Tee", description: "Heavyweight cotton oversized tee.", price: 29, ageGroup: "teen", gender: "boys",
    category: "oversized-t-shirts", collections: ["new-arrivals", "streetwear", "trending"], sizes: ["S","M","L","XL"], colors: ["Black","White"], stock: 50, isFeatured: true },
  { name: "Essential Hoodie", description: "Soft fleece everyday hoodie.", price: 49, discountPrice: 39, ageGroup: "adult", gender: "men",
    category: "hoodies", collections: ["best-sellers", "essentials", "winter-collection"], sizes: ["M","L","XL"], colors: ["Grey","Navy"], stock: 80, isFeatured: true },
  { name: "Embroidered Abaya", description: "Elegant abaya for Eid.", price: 89, ageGroup: "adult", gender: "women",
    category: "abayas", collections: ["eid-collection", "premium-collection"], sizes: ["52","54","56"], colors: ["Black"], stock: 30, isFeatured: true },
  { name: "Baby Cotton Romper", description: "Gentle organic cotton romper.", price: 18, ageGroup: "newborn", gender: "unisex",
    category: "rompers", collections: ["new-arrivals"], sizes: ["0-3M","3-6M","6-12M"], colors: ["White","Beige"], stock: 100 },
]);

const adminEmail = "admin@triora.com";
if (!(await User.findOne({ email: adminEmail }))) {
  await User.create({ name: "TRIORA Admin", email: adminEmail, password: await bcrypt.hash("Admin@123", 10), role: "admin" });
  console.log("Admin created -> admin@triora.com / Admin@123  (change this later!)");
}

console.log("Seed complete.");
await mongoose.disconnect();

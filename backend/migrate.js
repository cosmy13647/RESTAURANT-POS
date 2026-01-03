import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./db.js";
import Product from "./models/Product.js";
import Sale from "./models/Sale.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsFilePath = path.join(__dirname, "data", "products.json");
const salesFilePath = path.join(__dirname, "data", "sales.json");

const importData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await Product.deleteMany();
        await Sale.deleteMany();

        // Read JSON files
        const productsData = JSON.parse(fs.readFileSync(productsFilePath, "utf8"));
        const salesData = JSON.parse(fs.readFileSync(salesFilePath, "utf8"));

        // Insert Products
        if (productsData.products) {
            await Product.insertMany(productsData.products);
            console.log("✅ Products Imported!");
        }

        // Insert Sales
        if (salesData.length > 0) {
            await Sale.insertMany(salesData);
            console.log("✅ Sales Imported!");
        }

        console.log("🎉 Data Migration Completed!");
        process.exit();
    } catch (error) {
        console.error(`❌ Error with data import: ${error}`);
        process.exit(1);
    }
};

importData();

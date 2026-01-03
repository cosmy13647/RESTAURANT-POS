import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import Product from "./models/Product.js";
import Sale from "./models/Sale.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

app.use(cors());
app.use(express.json());

// Load products
app.get("/products", async (req, res) => {
  try {
    const allProducts = await Product.find({});
    res.json({ products: allProducts });
  } catch (error) {
    console.error("Error reading products:", error);
    res.status(500).json({ error: "Failed to load products" });
  }
});

// --- ADMIN ROUTES ---

// Create a new category
app.post("/products/category", async (req, res) => {
  try {
    const { category } = req.body;
    if (!category) return res.status(400).json({ error: "Category name required" });

    const newCategory = new Product({ category, items: [] });
    await newCategory.save();
    res.json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Failed to create category" });
  }
});

// Add item to category
app.post("/products/item", async (req, res) => {
  try {
    const { categoryId, name, price } = req.body;
    const category = await Product.findById(categoryId);
    if (!category) return res.status(404).json({ error: "Category not found" });

    category.items.push({ name, price });
    await category.save();
    res.json(category);
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ error: "Failed to add item" });
  }
});

// Delete an item
app.delete("/products/item", async (req, res) => {
  try {
    const { categoryId, itemId } = req.body;
    const category = await Product.findById(categoryId);
    if (!category) return res.status(404).json({ error: "Category not found" });

    // Filter out the item
    category.items = category.items.filter(item => item._id.toString() !== itemId);
    await category.save();
    res.json(category);
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

// Delete a category
app.delete("/products/category/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

// --------------------

// Record a sale
app.post("/sales", async (req, res) => {
  try {
    const saleData = req.body;

    // Create new sale in DB
    const newSale = new Sale(saleData);
    await newSale.save();

    res.json({ message: "Sale recorded successfully" });
  } catch (error) {
    console.error("Error saving sale:", error);
    res.status(500).json({ error: "Failed to save sale" });
  }
});

// Get today's total and sales list
app.get("/sales", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find sales for today
    const sales = await Sale.find({
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    const totalSales = sales.reduce((sum, s) => sum + (s.total || 0), 0);

    // Format sales to match previous structure if needed, or send as is
    // Previous structure: array of sale objects

    res.json({ totalSales, sales });
  } catch (error) {
    console.error("Error reading sales:", error);
    res.status(500).json({ error: "Failed to read sales" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

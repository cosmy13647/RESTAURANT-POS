import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import Product from "./models/Product.js";
import Sale from "./models/Sale.js";
import User from "./models/User.js";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

app.use(cors());
app.use(express.json());

// --- AUTH MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token." });
  }
};

// --- AUTH ROUTES ---

// Login route
app.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "Invalid username or password" });

    const validPassword = await user.comparePassword(password);
    if (!validPassword) return res.status(400).json({ error: "Invalid username or password" });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "8h" }
    );

    res.json({ token, user: { username: user.username, role: user.role } });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Initial Register route (should be protected or removed after first user)
app.post("/api/auth/register-initial", async (req, res) => {
  try {
    const { username, password } = req.body;
    const userCount = await User.countDocuments();
    if (userCount > 0) return res.status(403).json({ error: "Registration disabled after first user." });

    const newUser = new User({ username, password });
    await newUser.save();
    res.json({ message: "Initial admin user created successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

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

// --- ADMIN ROUTES --- (Protected)

// Create a new category
app.post("/products/category", authenticateToken, async (req, res) => {
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
app.post("/products/item", authenticateToken, async (req, res) => {
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
app.delete("/products/item", authenticateToken, async (req, res) => {
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
app.delete("/products/category/:id", authenticateToken, async (req, res) => {
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

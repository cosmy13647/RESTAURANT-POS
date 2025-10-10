import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// File paths
const productsFilePath = path.join(__dirname, "data", "products.json");
const salesFilePath = path.join(__dirname, "data", "sales.json");

// Load products
app.get("/products", (req, res) => {
  try {
    const data = fs.readFileSync(productsFilePath, "utf8");
    const products = JSON.parse(data);
    res.json({ products });

  } catch (error) {
    console.error("Error reading products:", error);
    res.status(500).json({ error: "Failed to load products" });
  }
});

// Record a sale
app.post("/sales", (req, res) => {
  try {
    const sale = req.body;

    // Load existing sales or create new file
    let sales = [];
    if (fs.existsSync(salesFilePath)) {
      const data = fs.readFileSync(salesFilePath, "utf8");
      sales = data ? JSON.parse(data) : [];
    }

    // Add new sale
    sale.date = new Date().toISOString();
    sales.push(sale);

    // Save file
    fs.writeFileSync(salesFilePath, JSON.stringify(sales, null, 2));

    res.json({ message: "Sale recorded successfully" });
  } catch (error) {
    console.error("Error saving sale:", error);
    res.status(500).json({ error: "Failed to save sale" });
  }
});

// Get today's total and sales list
app.get("/sales", (req, res) => {
  try {
    if (!fs.existsSync(salesFilePath)) {
      return res.json({ totalSales: 0, sales: [] });
    }

    const data = fs.readFileSync(salesFilePath, "utf8");
    const sales = data ? JSON.parse(data) : [];

    const today = new Date().toISOString().slice(0, 10);
    const todaySales = sales.filter(s => s.date?.startsWith(today));

    const totalSales = todaySales.reduce((sum, s) => sum + (s.total || 0), 0);

    res.json({ totalSales, sales: todaySales });
  } catch (error) {
    console.error("Error reading sales:", error);
    res.status(500).json({ error: "Failed to read sales" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

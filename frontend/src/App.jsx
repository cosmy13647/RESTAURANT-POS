import React, { useEffect, useState } from "react";
import axios from "axios";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import Sales from "./components/Sales";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [sales, setSales] = useState([]);
  const [totalSales, setTotalSales] = useState(0);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/products");
      // support either { products: [...] } or [] shapes
      const p = res.data.products ?? res.data;
      setProducts(Array.isArray(p) ? p : []);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchSales = async () => {
    try {
      const res = await axios.get("http://localhost:5000/sales");
      const data = res.data ?? {};
      const s = data.sales ?? (Array.isArray(data) ? data : []);
      const t =
        data.total ??
        data.totalSales ??
        data.totalAmount ??
        s.reduce((sum, item) => sum + (item.total || 0), 0);
      setSales(Array.isArray(s) ? s : []);
      setTotalSales(Number(t) || 0);
    } catch (err) {
      console.error("Error fetching sales:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSales();
    const interval = setInterval(fetchSales, 5000); // keep total updated
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <header className="bg-green-600 text-white text-center py-4 text-2xl font-bold shadow">
        Restaurant POS
      </header>

      <div className="flex gap-4 p-4 max-w-7xl mx-auto">
        {/* Left: Menu */}
        <div className="flex-1">
          <Menu products={products} cart={cart} setCart={setCart} />
        </div>

        {/* Middle: Cart (pass fetchSales so Cart can refresh totals after checkout) */}
        <div className="w-96">
          <Cart cart={cart} setCart={setCart} fetchSales={fetchSales} />
        </div>

        {/* Right: Sales summary */}
        <div className="w-80">
          <Sales sales={sales} total={totalSales} />
        </div>
      </div>
    </div>
  );
}

export default App;
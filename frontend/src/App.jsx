import React, { useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import Sales from "./components/Sales";
import Admin from "./components/Admin";
import Login from "./components/Login";
import API_URL from "./config";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [sales, setSales] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [token, setToken] = useState(localStorage.getItem("adminToken"));

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      const p = res.data.products ?? res.data;
      setProducts(Array.isArray(p) ? p : []);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchSales = async () => {
    try {
      const res = await axios.get(`${API_URL}/sales`);
      const data = res.data ?? {};
      const s = data.sales ?? (Array.isArray(data) ? data : []);
      const t = data.totalSales ?? s.reduce((sum, item) => sum + (item.total || 0), 0);
      setSales(Array.isArray(s) ? s : []);
      setTotalSales(Number(t) || 0);
    } catch (err) {
      console.error("Error fetching sales:", err);
    }
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.name === product.name);
      if (existing) {
        return prev.map((item) =>
          item.name === product.name
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (name, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.name === name) {
          const newQty = Math.max(1, (item.quantity || 1) + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (name) => {
    setCart((prev) => prev.filter((item) => item.name !== name));
  };

  useEffect(() => {
    fetchProducts();
    fetchSales();
    const interval = setInterval(fetchSales, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setToken(null);
  };

  const POSView = () => (
    <div className="flex flex-col lg:flex-row gap-6 p-6 max-w-[1600px] mx-auto h-[calc(100vh-100px)]">
      <section className="flex-1 min-w-0 h-full">
        <Menu products={products} addToCart={addToCart} />
      </section>
      <section className="w-full lg:w-[400px] flex-shrink-0 h-full">
        <Cart
          cart={cart}
          setCart={setCart}
          fetchSales={fetchSales}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
        />
      </section>
      <section className="w-full lg:w-[320px] flex-shrink-0 h-full">
        <Sales sales={sales} total={totalSales} />
      </section>
    </div>
  );

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
        <header className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-5 shadow-lg relative z-10">
          <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
            <Link to="/" className="hover:opacity-90 transition-opacity">
              <h1 className="text-3xl font-extrabold tracking-tight">Restaurant POS</h1>
              <p className="text-emerald-100 text-sm mt-1 opacity-90">Manage orders and sales efficiently</p>
            </Link>
            <div className="flex items-center gap-6">
              {token ? (
                <div className="flex items-center gap-4">
                  <Link
                    to="/admin"
                    className="px-4 py-2 bg-white text-emerald-700 rounded-full font-bold text-sm hover:bg-emerald-50 transition-colors"
                  >
                    Admin Panel
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 border border-emerald-400 hover:bg-emerald-500 rounded-full font-bold text-sm transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-black/20 hover:bg-black/30 rounded-full font-bold text-sm transition-colors"
                >
                  Admin Login
                </Link>
              )}
            </div>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<POSView />} />
            <Route
              path="/login"
              element={token ? <Navigate to="/admin" /> : <Login setToken={setToken} />}
            />
            <Route
              path="/admin"
              element={
                token ? (
                  <div className="p-6 max-w-[1600px] mx-auto h-[calc(100vh-100px)]">
                    <Admin products={products} fetchProducts={fetchProducts} token={token} />
                  </div>
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
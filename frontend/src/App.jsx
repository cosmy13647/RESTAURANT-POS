import React, { useEffect, useState } from "react";
import axios from "axios";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import Sales from "./components/Sales";
import Admin from "./components/Admin";
import API_URL from "./config";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [sales, setSales] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      // support either { products: [...] } or [] shapes
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

  /* Smart Cart Logic */
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
    const interval = setInterval(fetchSales, 5000); // keep total updated
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      <header className={`bg-gradient-to-r ${isAdmin ? 'from-slate-700 to-slate-800' : 'from-emerald-600 to-teal-600'} text-white py-5 shadow-lg relative z-10 transition-colors duration-500`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Restaurant POS</h1>
            <p className="text-emerald-100 text-sm mt-1 opacity-90">{isAdmin ? 'Admin Dashboard - Manage Menu' : 'Manage orders and sales efficiently'}</p>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${isAdmin ? 'bg-white text-slate-800' : 'bg-black/20 hover:bg-black/30'}`}
            >
              {isAdmin ? 'Exit Admin' : 'Admin Area'}
            </button>
            <div className="text-right">
              <div className="text-emerald-100 text-xs font-medium uppercase tracking-wider">Status</div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-semibold">Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex flex-col lg:flex-row gap-6 p-6 max-w-[1600px] mx-auto h-[calc(100vh-100px)]">
        {isAdmin ? (
          <section className="w-full h-full">
            <Admin products={products} fetchProducts={fetchProducts} />
          </section>
        ) : (
          <>
            {/* Left: Menu - Grows to fill space */}
            <section className="flex-1 min-w-0 h-full">
              <Menu products={products} addToCart={addToCart} />
            </section>

            {/* Middle: Cart - Fixed width */}
            <section className="w-full lg:w-[400px] flex-shrink-0 h-full">
              <Cart
                cart={cart}
                setCart={setCart}
                fetchSales={fetchSales}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
              />
            </section>

            {/* Right: Sales summary - Fixed width */}
            <section className="w-full lg:w-[320px] flex-shrink-0 h-full">
              <Sales sales={sales} total={totalSales} />
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
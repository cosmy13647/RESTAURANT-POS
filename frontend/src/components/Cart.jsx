import React, { useState } from "react";
import axios from "axios";

function Cart({ cart, setCart, fetchSales, updateQuantity, removeFromCart }) {
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [notes, setNotes] = useState("");

  const total = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

  const completeSale = async () => {
    if (cart.length === 0) return alert("Cart is empty!");

    try {
      await axios.post("http://localhost:5000/sales", {
        items: cart,
        total,
        paymentMethod,
        notes
      });
      alert("✅ Sale completed!");
      setCart([]);
      setNotes("");
      setPaymentMethod("Cash");
      fetchSales(); // refresh sales after save
    } catch (error) {
      console.error("Error saving sale:", error);
      alert("❌ Failed to complete sale");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl h-full flex flex-col border border-slate-100 overflow-hidden relative">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Current Order
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
            <svg className="w-16 h-16 mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            <p>No items added yet</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {cart.map((item, index) => (
              <li
                key={index}
                className="p-3 bg-slate-50 border border-transparent hover:border-emerald-100 rounded-xl flex justify-between items-center group transition-all"
              >
                <div>
                  <span className="font-medium text-slate-700 block">{item.name}</span>
                  <span className="text-xs text-slate-400">@ Ksh {item.price}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-white rounded-lg border border-slate-200 shadow-sm">
                    <button
                      onClick={() => item.quantity > 1 ? updateQuantity(item.name, -1) : removeFromCart(item.name)}
                      className="px-2 py-1 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-l-lg transition-colors"
                    >
                      -
                    </button>
                    <span className="px-2 font-mono font-bold text-sm text-slate-700 min-w-[20px] text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.name, 1)}
                      className="px-2 py-1 text-slate-500 hover:text-emerald-500 hover:bg-emerald-50 rounded-r-lg transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-bold text-slate-700 w-16 text-right">Ksh {item.price * item.quantity}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="p-5 bg-slate-50 border-t border-slate-100 space-y-4">

        {/* Payment & Notes */}
        {cart.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full text-sm bg-white border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Cash">Cash</option>
                <option value="M-Pesa">M-Pesa</option>
                <option value="Card">Card</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Notes</label>
              <input
                type="text"
                placeholder="e.g. No Sugar"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-sm bg-white border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-2">
          <span className="text-slate-500 font-medium">Total Amount</span>
          <span className="text-3xl font-extrabold text-slate-800">Ksh {total}</span>
        </div>

        <button
          onClick={completeSale}
          disabled={cart.length === 0}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transform transition-all active:scale-[0.98] flex items-center justify-center gap-2
            ${cart.length === 0
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-emerald-500/30'}`}
        >
          <span>Complete Sale</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        </button>
      </div>
    </div>
  );
}

export default Cart;

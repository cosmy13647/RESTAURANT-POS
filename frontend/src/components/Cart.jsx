import React from "react";
import axios from "axios";

function Cart({ cart, setCart, fetchSales }) {
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const completeSale = async () => {
    if (cart.length === 0) return alert("Cart is empty!");

    try {
      await axios.post("http://localhost:5000/sales", {
        items: cart,
        total,
      });
      alert("✅ Sale completed!");
      setCart([]);
      fetchSales(); // refresh sales after save
    } catch (error) {
      console.error("Error saving sale:", error);
      alert("❌ Failed to complete sale");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Cart</h2>
      {cart.length === 0 ? (
        <p className="text-gray-500">Cart is empty</p>
      ) : (
        <ul className="space-y-2">
          {cart.map((item, index) => (
            <li
              key={index}
              className="p-2 bg-white border rounded flex justify-between items-center shadow-sm"
            >
              <span>{item.name}</span>
              <span>Ksh {item.price}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 font-bold">
        Total: <span className="text-blue-600">Ksh {total}</span>
      </div>

      <button
        onClick={completeSale}
        className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
      >
        Complete Sale
      </button>
    </div>
  );
}

export default Cart;

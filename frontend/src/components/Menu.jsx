import React from "react";

function Menu({ products = [], cart, setCart }) {
  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  // handle loading state
  if (!products || !Array.isArray(products)) {
    return <p className="text-gray-500">Loading menu...</p>;
  }

  return (
    <div className="flex flex-col bg-white rounded-xl shadow p-4 overflow-y-auto h-full">
      <h2 className="text-2xl font-bold mb-4 border-b pb-2">Menu</h2>

      {/* categories and items */}
      {products.map((category, i) => (
        <div key={i} className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {category.category}
          </h3>

          <div className="flex flex-col gap-2">
            {category.items.map((item, j) => (
              <div
                key={j}
                className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-3 rounded-lg shadow-sm transition"
              >
                <span className="text-gray-800 font-medium">
                  {item.name} — Ksh {item.price}
                </span>
                <button
                  onClick={() => addToCart(item)}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded-md"
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Menu;
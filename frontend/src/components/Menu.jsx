import React, { useState } from "react";

function Menu({ products = [], addToCart }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // handle loading state
  if (!products || !Array.isArray(products)) {
    return <p className="text-gray-500">Loading menu...</p>;
  }

  const categories = ["All", ...products.map((p) => p.category)];

  const filteredProducts = products
    .map((cat) => {
      // If specific category selected, ignore others
      if (selectedCategory !== "All" && cat.category !== selectedCategory) return null;

      // Filter items by search
      const items = cat.items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (items.length === 0) return null;

      return { ...cat, items };
    })
    .filter(Boolean);

  return (
    <div className="bg-white rounded-2xl shadow-xl h-full overflow-hidden flex flex-col border border-slate-100">
      <div className="p-5 border-b border-slate-100 bg-white/50 backdrop-blur-sm sticky top-0 z-10 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Menu
          </h2>
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-emerald-500 w-64 outline-none transition-all"
            />
            <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                ${selectedCategory === cat
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-y-auto p-5 space-y-8 custom-scrollbar flex-1">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 opacity-50">No items found</div>
        ) : filteredProducts.map((category, i) => (
          <div key={i}>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 pl-1 sticky top-0 bg-white/95 py-2 z-0 backdrop-blur-sm">
              {category.category}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-3">
              {category.items.map((item, j) => (
                <div
                  key={j}
                  className="group bg-slate-50 hover:bg-white border border-transparent hover:border-emerald-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
                  onClick={() => addToCart(item)}
                >
                  <div>
                    <h4 className="font-semibold text-slate-700 text-lg leading-tight mb-1 group-hover:text-emerald-700 transition-colors">
                      {item.name}
                    </h4>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Ksh {item.price}</span>
                    <button
                      className="bg-white text-emerald-600 border border-emerald-200 w-8 h-8 rounded-full flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Menu;
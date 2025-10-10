import React from "react";

function Sales({ sales, total }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Today's Sales</h2>

      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <p className="font-bold text-blue-700">
          Total of the Day: Ksh {total}
        </p>
      </div>

      {sales.length === 0 ? (
        <p className="text-gray-500">No sales yet today</p>
      ) : (
        <ul className="space-y-3">
          {sales.map((sale) => (
            <li
              key={sale.id}
              className="p-3 bg-white border rounded shadow-sm text-sm"
            >
              <p className="font-semibold">Sale ID: {sale.id}</p>
              <p className="text-gray-600">
                Total: <span className="text-blue-600">Ksh {sale.total}</span>
              </p>
              <ul className="mt-1 text-gray-500 text-xs">
                {sale.items.map((item, i) => (
                  <li key={i}>- {item.name}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Sales;

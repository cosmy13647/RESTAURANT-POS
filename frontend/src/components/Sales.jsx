import React from "react";

function Sales({ sales, total }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl h-full flex flex-col border border-slate-100 overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Today's Sales
        </h2>
      </div>

      <div className="p-5 pb-0">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white shadow-lg mb-6">
          <p className="text-blue-100 text-sm font-medium mb-1">Total Revenue</p>
          <p className="text-3xl font-extrabold tracking-tight">Ksh {total}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 pb-5 custom-scrollbar">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Recent Transactions</h3>
        {sales.length === 0 ? (
          <div className="text-center py-10 text-slate-400 opacity-60">
            <p>No sales recorded today</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {sales.map((sale) => (
              <li
                key={sale._id}
                className="p-4 bg-slate-50 border border-transparent hover:border-blue-100 rounded-xl transition-all group"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-md font-mono">
                    #{sale._id.slice(-6)}
                  </div>
                  <span className="font-bold text-slate-800">Ksh {sale.total}</span>
                </div>

                <ul className="space-y-1">
                  {sale.items.map((item, i) => (
                    <li key={i} className="text-xs text-slate-500 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      {item.name}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Sales;

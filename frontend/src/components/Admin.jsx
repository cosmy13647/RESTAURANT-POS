import React, { useState } from "react";
import axios from "axios";
import API_URL from "../config";

function Admin({ products, fetchProducts, token }) {
    const [newCatName, setNewCatName] = useState("");
    const [newItem, setNewItem] = useState({ categoryId: "", name: "", price: "" });

    const authHeader = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const createCategory = async () => {
        if (!newCatName) return alert("Enter category name");
        try {
            await axios.post(`${API_URL}/products/category`, { category: newCatName }, authHeader);
            alert("✅ Category Created");
            setNewCatName("");
            fetchProducts();
        } catch (err) {
            console.error(err);
            alert("Error creating category: " + (err.response?.data?.error || "Unknown error"));
        }
    };

    const addItem = async () => {
        if (!newItem.categoryId || !newItem.name || !newItem.price) return alert("Fill all fields");
        try {
            await axios.post(`${API_URL}/products/item`, newItem, authHeader);
            alert("✅ Item Added");
            setNewItem({ ...newItem, name: "", price: "" }); // keep category selected
            fetchProducts();
        } catch (err) {
            console.error(err);
            alert("Error adding item: " + (err.response?.data?.error || "Unknown error"));
        }
    };

    const deleteCategory = async (id) => {
        if (!window.confirm("Delete this entire category?")) return;
        try {
            await axios.delete(`${API_URL}/products/category/${id}`, authHeader);
            fetchProducts();
        } catch (err) {
            console.error(err);
            alert("Error deleting category: " + (err.response?.data?.error || "Unknown error"));
        }
    };

    const deleteItem = async (categoryId, itemId) => {
        if (!window.confirm("Delete this item?")) return;
        try {
            await axios.delete(`${API_URL}/products/item`, {
                ...authHeader,
                data: { categoryId, itemId }
            });
            fetchProducts();
        } catch (err) {
            console.error(err);
            alert("Error deleting item: " + (err.response?.data?.error || "Unknown error"));
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl h-full flex flex-col border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-red-50">
                <h2 className="text-xl font-bold text-red-800 flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Admin Dashboard
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-8">

                {/* Actions Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* New Category */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <h3 className="font-bold text-slate-700 mb-3">Add New Category</h3>
                        <div className="flex gap-2">
                            <input
                                className="flex-1 p-2 border rounded-lg text-sm"
                                placeholder="Category Name"
                                value={newCatName}
                                onChange={(e) => setNewCatName(e.target.value)}
                            />
                            <button onClick={createCategory} className="bg-slate-800 text-white px-4 rounded-lg text-sm hover:bg-slate-900">Add</button>
                        </div>
                    </div>

                    {/* New Item */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <h3 className="font-bold text-slate-700 mb-3">Add New Item</h3>
                        <div className="space-y-2">
                            <select
                                className="w-full p-2 border rounded-lg text-sm bg-white"
                                value={newItem.categoryId}
                                onChange={(e) => setNewItem({ ...newItem, categoryId: e.target.value })}
                            >
                                <option value="">Select Category</option>
                                {products.map(p => <option key={p._id} value={p._id}>{p.category}</option>)}
                            </select>
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 p-2 border rounded-lg text-sm"
                                    placeholder="Item Name"
                                    value={newItem.name}
                                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                />
                                <input
                                    className="w-24 p-2 border rounded-lg text-sm"
                                    placeholder="Price"
                                    type="number"
                                    value={newItem.price}
                                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                                />
                            </div>
                            <button onClick={addItem} className="w-full bg-emerald-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">Add Item</button>
                        </div>
                    </div>
                </div>

                {/* Management List */}
                <div>
                    <h3 className="font-bold text-slate-400 uppercase tracking-wider text-sm mb-4">Manage Current Menu</h3>
                    <div className="space-y-6">
                        {products.map(cat => (
                            <div key={cat._id} className="border border-slate-200 rounded-xl overflow-hidden">
                                <div className="bg-slate-100 p-3 flex justify-between items-center">
                                    <h4 className="font-bold text-slate-700">{cat.category}</h4>
                                    <button onClick={() => deleteCategory(cat._id)} className="text-red-500 text-xs hover:bg-red-50 px-2 py-1 rounded">Delete Category</button>
                                </div>
                                <div className="p-3 bg-white">
                                    {cat.items.length === 0 ? <p className="text-slate-400 text-sm italic">No items</p> : (
                                        <ul className="space-y-2">
                                            {cat.items.map(item => (
                                                <li key={item._id} className="flex justify-between items-center text-sm border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                                                    <span>{item.name} <span className="text-slate-400 mx-1">—</span> Ksh {item.price}</span>
                                                    <button onClick={() => deleteItem(cat._id, item._id)} className="text-red-400 hover:text-red-600">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Admin;

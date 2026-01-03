import mongoose from "mongoose";

const SaleSchema = new mongoose.Schema({
    items: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true, default: 1 },
            notes: { type: String },
        },
    ],
    total: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        enum: ["Cash", "M-Pesa", "Card"],
        default: "Cash",
    },
    notes: { type: String },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Sale = mongoose.model("Sale", SaleSchema);

export default Sale;

import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
    },
    items: [
        {
            name: { type: String, required: true },
            price: { type: Number, required: true },
        },
    ],
});

const Product = mongoose.model("Product", ProductSchema);

export default Product;

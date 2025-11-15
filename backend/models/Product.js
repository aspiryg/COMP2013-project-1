import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    brand: { type: String, required: true },
    image: { type: String },
    price: { type: String, required: true }, // I had to keep both fields (price, quantity) as String to be consistent the prvided data and the previous project structure
    quantity: { type: String, required: true }, // Stock quantity // I added this field
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema, "products");

// ES6 export syntax
export default Product;

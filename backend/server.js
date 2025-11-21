/*
    Ahmad Spierij
    COMP2013 Project 2 - Backend Server
*/

// I used ES6 modules instead of CommonJS (Just to use import/export syntax), I added "type": "module" in package.json
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "./models/Product.js";

// Load environment variables
dotenv.config();

// Initialization
const server = express();
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;

// Middleware
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());

// Start the server after connecting to the database
mongoose.connect(DB_URI).then(() => {
  server.listen(PORT, () => {
    console.log(
      `Database connected successfully.\nServer is running on http://localhost:${PORT}`
    );
  });
});

// Routes
// Root route
server.get("/", (req, res) => {
  res.send(
    "Welcome to the COMP2013 Project 2 Backend Server!\nServer is Live."
  );
});

// Get all Products
server.get("/products", async (request, response) => {
  try {
    const products = await Product.find();
    response.status(200).send(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    response
      .status(500)
      .send({ message: "Server Error", error: error.message });
  }
});

// Add a new Product
server.post("/products", async (request, response) => {
  const { productName, brand, image, price, quantity } = request.body;
  try {
    const newProduct = new Product({
      productName,
      brand,
      image,
      price,
      quantity,
    });
    const savedProduct = await newProduct.save();
    response
      .status(201)
      .send({ message: "Product added successfully", product: savedProduct }); // I will use the returned newly created product to update the UI directly on the frontend
  } catch (error) {
    console.error("Error adding product:", error);
    response
      .status(500)
      .send({ message: "Server Error", error: error.message });
  }
});

// Delete a Product
server.delete("/products/:id", async (request, response) => {
  const productId = request.params.id;
  try {
    const deletedProduct = await Product.findByIdAndDelete(productId);
    response.status(200).send({
      message: `Product ${deletedProduct.productName} deleted successfully`,
      productId: deletedProduct._id, // could be useful on the frontend
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    response
      .status(500)
      .send({ message: "Server Error", error: error.message });
  }
});

// Get a single Product by ID
server.get("/products/:id", async (request, response) => {
  const productId = request.params.id;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return response.status(404).send({ message: "Product not found" });
    }
    response.status(200).send(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    response
      .status(500)
      .send({ message: "Server Error", error: error.message });
  }
});

// Update a Product by ID
server.patch("/products/:id", async (request, response) => {
  const productId = request.params.id;
  const { productName, brand, image, price, quantity } = request.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { productName, brand, image, price, quantity },
      { new: true } // to return the updated document after update (not the original one), Thsi can be useful on the frontend
    );
    if (!updatedProduct) {
      return response.status(404).send({ message: "Product not found" });
    }
    response.status(200).send({
      message: `Product ${updatedProduct.productName} updated successfully`,
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    response
      .status(500)
      .send({ message: "Server Error", error: error.message });
  }
});

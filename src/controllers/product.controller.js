const product = require("../models/productsModel");
// fetching all data from the database
const getProducts = async (req, res) => {
  try {
    const products = await product.find({});
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// fetching a single product from the database
const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const singleProduct = await product.findById(id);
    if (!singleProduct) {
      return res.status(404).json({ message: "product not found" });
    }
    res.status(200).json(singleProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// adding a new product
const addProduct = async (req, res) => {
  try {
    const newProduct = await product.create(req.body);
    res.status(200).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// updating a product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const Product = await product.findByIdAndUpdate(id, req.body);
    if (!Product) {
      return res.status(404).json({ message: "product not found" });
    }
    const updatedProduct = await product.findById(id);
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const Product = await product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = { getProduct,getProducts,addProduct,  updateProduct,deleteProduct,
};

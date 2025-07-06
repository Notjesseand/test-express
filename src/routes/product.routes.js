const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

// getting all products in the databse
router.get("/", getProducts);

// getting a single product based on ID
router.get("/:id", getProduct);

// adding a new product
router.post("/", addProduct);

// updating a product
router.put("/:id", updateProduct);

// deleting a product
router.delete("/:id", deleteProduct);

module.exports = router;

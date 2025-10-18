// routes/products.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Public
router.get('/', productController.listProducts);
router.get('/:id', productController.getProduct);

// Seller-only CRUD
router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
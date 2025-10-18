// routes/orders.js
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const orderController = require('../controllers/orderController');

router.post('/', ensureAuthenticated, orderController.createOrder); // checkout
router.get('/', ensureAuthenticated, orderController.listOrders); // user orders
router.get('/:id', ensureAuthenticated, orderController.getOrder);

module.exports = router;
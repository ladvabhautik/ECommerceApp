// controllers/orderController.js
const pool = require('../db');

async function createOrder(req, res) {
    const customer_id = req.session.user.id;
    const { items } = req.body; // items = [{ product_id, quantity }]
    if (!items || !items.length) return res.status(400).json({ message: 'Cart is empty' });

    // Fetch products to calculate total and check stock
    const productIds = items.map(i => i.product_id);
    const [products] = await pool.query(`SELECT * FROM products WHERE id IN (${productIds.map(() => '?').join(',')})`, productIds);

    // map id->product
    const map = {};
    products.forEach(p => map[p.id] = p);

    let total = 0;
    for (const it of items) {
        const p = map[it.product_id];
        if (!p) return res.status(400).json({ message: `Product ${it.product_id} not found` });
        if (p.stock < it.quantity) return res.status(400).json({ message: `Not enough stock for ${p.title}` });
        total += parseFloat(p.price) * it.quantity;
    }

    // create order
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const [orderRes] = await conn.query('INSERT INTO orders (customer_id, total) VALUES (?, ?)', [customer_id, total]);
        const orderId = orderRes.insertId;

        for (const it of items) {
            const p = map[it.product_id];
            await conn.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)', [
                orderId, it.product_id, it.quantity, p.price
            ]);
            // reduce stock
            await conn.query('UPDATE products SET stock = stock - ? WHERE id = ?', [it.quantity, it.product_id]);
        }

        await conn.commit();
        res.json({ message: 'Order placed', orderId });
    } catch (err) {
        await conn.rollback();
        console.error(err);
        res.status(500).json({ message: 'Order failed' });
    } finally {
        conn.release();
    }
}

async function listOrders(req, res) {
    const user = req.session.user;
    if (!user) return res.status(401).json({ message: 'Not logged in' });

    // Customers see their orders; admin may see all (optional)
    let ordersQuery = 'SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC';
    const [orders] = await pool.query(ordersQuery, [user.id]);

    // fetch items for each order
    for (const ord of orders) {
        const [items] = await pool.query('SELECT oi.*, p.title FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE order_id = ?', [ord.id]);
        ord.items = items;
    }
    res.json(orders);
}

async function getOrder(req, res) {
    const user = req.session.user;
    const id = req.params.id;
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (!orders.length) return res.status(404).json({ message: 'Order not found' });
    const order = orders[0];
    if (order.customer_id !== user.id && user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    const [items] = await pool.query('SELECT oi.*, p.title FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE order_id = ?', [id]);
    order.items = items;
    res.json(order);
}

module.exports = { createOrder, listOrders, getOrder };
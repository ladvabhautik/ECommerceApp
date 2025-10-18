// controllers/productController.js
const pool = require('../db');

async function listProducts(req, res) {
    const [rows] = await pool.query('SELECT p.*, u.name as seller_name FROM products p JOIN users u ON p.seller_id = u.id');
    res.json(rows);
}

async function getProduct(req, res) {
    const id = req.params.id;
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ message: 'Product not found' });
    res.json(rows[0]);
}

async function createProduct(req, res) {
    const seller_id = req.body.seller_id;

    const { title, description, price, stock, category, image } = req.body;
    const [result] = await pool.query(
        'INSERT INTO products (seller_id, title, description, price, stock, category, image) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [seller_id, title, description || '', price || 0, stock || 0, category, image]
    );
    res.json({ message: 'Product created', id: result.insertId });
}

async function updateProduct(req, res) {
    const seller_id = req.body.seller_id;
    const id = req.params.id;
    // ensure seller owns product or is admin (optional: if admin allowed)
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ message: 'Product not found' });
    const product = rows[0];
    if (product.seller_id !== seller_id) return res.status(403).json({ message: 'Not your product' });

    const { title, description, price, stock, category, image } = req.body;
    await pool.query(
        'UPDATE products SET title = ?, description = ?, price = ?, stock = ?, category = ?, image = ? WHERE id = ?',
        [title || product.title, description || product.description, price ?? product.price, stock ?? product.stock, category || product.category, image || product.image, id]
    );
    res.json({ message: 'Product updated' });
}

async function deleteProduct(req, res) {
    const seller_id = req.body.seller_id;
    const id = req.params.id;

    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ message: 'Product not found' });
    if (rows[0].seller_id !== seller_id) return res.status(403).json({ message: 'Not your product' });

    await pool.query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'Product deleted' });
}

module.exports = { listProducts, getProduct, createProduct, updateProduct, deleteProduct };
// routes/admin.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const { ensureAuthenticated, ensureRole } = require('../middleware/auth');

router.get('/', async (req, res) => {
    const [rows] = await pool.query('SELECT id, name, email, role, created_at FROM users');
    res.json(rows);
});

router.post('/users/:id/role', ensureAuthenticated, ensureRole('admin'), async (req, res) => {
    const id = req.params.id;
    const { role } = req.body; // admin | seller | customer
    if (!['admin', 'seller', 'customer'].includes(role)) return res.status(400).json({ message: 'Invalid role' });
    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
    res.json({ message: 'Role updated' });
});

module.exports = router;
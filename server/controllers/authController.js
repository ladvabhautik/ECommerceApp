// controllers/authController.js
const pool = require('../db');
const bcrypt = require('bcrypt');

const saltRounds = 10;

async function register(req, res) {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length) return res.status(400).json({ message: 'Email already registered' });

        const hashed = await bcrypt.hash(password, saltRounds);
        const [result] = await pool.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [
            name, email, hashed, role || 'customer'
        ]);

        const user = { id: result.insertId, name, email, role: role || 'customer' };
        req.session.user = user;
        res.json({ message: 'Registered', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (!rows.length) return res.status(400).json({ message: 'Invalid credentials' });

        const user = rows[0];
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

        // do not send password
        req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };
        res.json({ message: 'Logged in', user: req.session.user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

function logout(req, res) {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ message: 'Could not logout' });
        res.json({ message: 'Logged out' });
    });
}

function me(req, res) {
    if (req.session && req.session.user) return res.json({ user: req.session.user });
    return res.status(401).json({ message: 'Not logged in' });
}

module.exports = { register, login, logout, me };
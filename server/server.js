// server.js
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const adminRoutes = require('./routes/admin');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

app.use(session({
    secret: process.env.SESSION_SECRET || 'secret_dev',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 2 }
}));

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/users', adminRoutes);

app.get('/', (req, res) => res.json({ message: 'IBL Finance Ecommerce API running' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
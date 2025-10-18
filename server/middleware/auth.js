// middleware/auth.js
function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.user) return next();
    return res.status(401).json({ message: 'Unauthorized' });
}

function ensureRole(role) {
    return (req, res, next) => {
        if (req.session && req.session.user && req.session.user.role === role) return next();
        return res.status(403).json({ message: 'Forbidden: insufficient role' });
    };
}

module.exports = { ensureAuthenticated, ensureRole };
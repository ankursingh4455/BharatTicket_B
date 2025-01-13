const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(401).json({ message: "No token provided" });

    jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key', (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = user;
        next();
    });
}

function isBroker(req, res, next) {
    authenticateToken(req, res, () => {
        if (req.user && req.user.role === 'broker') {
            next();
        } else {
            res.status(403).json({ message: "Access denied" });
        }
    });
}

module.exports = { authenticateToken, isBroker };

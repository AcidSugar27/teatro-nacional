const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        console.log(req.user);
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid token' });
    }
};

const checkRole = (roles) => (req, res, next) => {
    if (!req.user || !req.user.rol) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    
    console.log('User role:', req.user.rol);

    if (!roles.includes(req.user.rol)) {
        return res.status(403).json({ error: 'Access denied' });
    }
    next();
};

module.exports = { authenticateToken, checkRole };

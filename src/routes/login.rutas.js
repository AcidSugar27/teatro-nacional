const express = require('express');
const { authenticateToken, checkRole } = require('../middleware/auth.middleware');
const { loguear, registrar, verificarEmail, getUserData } = require('../controllers/login.controller');

const router = express.Router();

router.post('/register', registrar);
router.post('/login', loguear);
router.get('/verify-email', verificarEmail);
router.get('/user', getUserData);

// Rutas protegidas
router.post('/admin/create-show', authenticateToken, checkRole(['admin']), async (req, res) => {
    // Lógica para crear un show
    res.json({ message: 'Show created' });
});

router.post('/user/purchase-ticket', authenticateToken, checkRole(['user', 'admin']), async (req, res) => {
    // Lógica para que los usuarios compren tickets
    res.json({ message: 'Ticket purchased' });
});

module.exports = router;

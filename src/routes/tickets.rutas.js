// routes.js
const { Router } = require('express');


const authenticateToken = require('../middleware/auth.middleware'); // Middleware para autenticar usuarios
const {comprarTickets, confirmarCompra} = require('../controllers/tickets.controller')

const router = Router();
// Ruta para comprar boletos asociados a una cartelera específica
router.post('/cartelera/:id/comprar',  comprarTickets);

// Ruta para confirmar la compra y actualizar el conteo de boletos vendidos
router.post('/cartelera/:id/confirmar-compra',  confirmarCompra);

module.exports = router;




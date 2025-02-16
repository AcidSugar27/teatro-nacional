const { Router } = require('express');

const { authenticateToken } = require('../middleware/auth.middleware'); 
const { comprarTickets, confirmarCompra, obtenerCompra } = require('../controllers/tickets.controller');

const router = Router();

/*
const validatePurchaseRequest = (req, res, next) => {
    const { cantidad_tickets } = req.body;
    if (!cantidad_tickets || cantidad_tickets <= 0) {
        return res.status(400).json({ message: "La cantidad de tickets debe ser un número mayor a 0" });
    }
    next();
};

*/
router.post(
    '/cartelera/:id/comprar',
              
    authenticateToken,
    comprarTickets             
);

router.post(
    '/cartelera/:id/confirmar',
     authenticateToken,      
    confirmarCompra             
);

router.get(
    '/compras/:payment_intent_id',
    authenticateToken,
    obtenerCompra
  );

module.exports = router;





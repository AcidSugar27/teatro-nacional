const { Router } = require('express');

const { authenticateToken } = require('../middleware/auth.middleware'); 
const { obtenerTodasLasCompras, obtenerComprasUsuario } = require('../controllers/compras.controller');

const router = Router();


router.get(
    '/mis-ordenes',
    authenticateToken,
    obtenerComprasUsuario
  );

router.get(
    '/todas-las-ordenes',
    authenticateToken,
    obtenerTodasLasCompras
  );

module.exports = router;

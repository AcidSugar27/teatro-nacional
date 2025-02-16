const express = require('express');
const { authenticateToken, checkRole } = require('../middleware/auth.middleware');
const { loguear, registrar, verificarEmail, getUserData, forgotPassword, resetPassword } = require('../controllers/login.controller');


const router = express.Router();

router.post('/register', registrar);
router.post('/login', loguear);
router.get('/verify-email', verificarEmail);
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.get('/user', getUserData);



module.exports = router;

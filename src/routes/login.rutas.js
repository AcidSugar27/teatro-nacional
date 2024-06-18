const express = require("express")


const { loguear, registrar } = require("../controllers/login.controller");

const router = express.Router();

router.post('/register', registrar);
router.post('/login', loguear);

module.exports = router;

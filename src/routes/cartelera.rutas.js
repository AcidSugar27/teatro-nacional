const { Router } = require('express');
const {
    getCartelera,
    getAllCartelera,
    createCartelera,
    deleteCartelera,
    updateCartelera
}  = require('../controllers/cartelera.controller')

const router = Router();

router.get('/cartelera/:id', getCartelera);
router.get('/cartelera', getAllCartelera);
router.post('/cartelera', createCartelera);
router.delete('/cartelera/:id', deleteCartelera);
router.put('/cartelera/:id', updateCartelera);

module.exports = router;
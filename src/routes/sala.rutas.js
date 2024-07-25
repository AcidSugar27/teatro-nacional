const { Router } = require('express');
const {
    getSala,
    getAllSala,
    createSala,
    deleteSala,
    updateSala
} = require('../controllers/sala.controller')

const router = Router();

router.get('/sala/:id', getSala);
router.get('/sala', getAllSala);
router.post('/sala', createSala);
router.delete('/sala/:id', deleteSala);
router.put('/sala/:id', updateSala);

module.exports = router;

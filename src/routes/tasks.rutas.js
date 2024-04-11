const { Router } = require('express');

const router = Router();

router.get('/tasks', (req, res) => {
    res.send('conseguir tarea');

})
router.get('/tasks/10', (req, res) => {
    res.send('conseguir una tarea especifica');

})
router.post('/tasks', (req, res) => {
    res.send('crear tarea');

})
router.delete('/tasks', (req, res) => {
    res.send('borrar tarea');

})
router.put('/tasks', (req, res) => {
    res.send('actualizar');

})


module.exports = router;
const { Router } = require('express');
const {
    getCartelera,
    getAllCartelera,
    createCartelera,
    deleteCartelera,
    updateCartelera
} = require('../controllers/cartelera.controller');
const { authenticateToken, checkRole } = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');

// Configuración de Multer para almacenar las imágenes en la carpeta 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    // Crear un nombre único para cada archivo basado en la fecha y extensión original
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Inicializar Multer con la configuración de almacenamiento
const upload = multer({ storage: storage });

const router = Router();


router.get('/cartelera/:id', getCartelera);


router.get('/cartelera',  getAllCartelera);


router.post(
  '/cartelera',          
  upload.single('imagen_url'),      
  createCartelera                   
);


router.put(
  '/cartelera/:id',           
  upload.single('imagen_url'),     
  updateCartelera                   
);


router.delete(
  '/cartelera/:id',           
  deleteCartelera                   
);



module.exports = router;

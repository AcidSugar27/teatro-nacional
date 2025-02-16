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


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  
  },
  filename: (req, file, cb) => {
   
    cb(null, Date.now() + path.extname(file.originalname));
  }
});


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

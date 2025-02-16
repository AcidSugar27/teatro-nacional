const pool = require('../db');
//obtener una compra en especifico de un usuario
const obtenerComprasUsuario = async (req, res) => {
    try {
        const user_id = req.user.id; 
        const result = await pool.query(
            `SELECT c.*, e.nombre AS evento_nombre 
             FROM compras c 
             JOIN cartelera e ON c.cartelera_id = e.id 
             WHERE c.user_id = $1`,
            [user_id]
        );

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener compras del usuario." });
    }
};
//Obtener todas las compras
const obtenerTodasLasCompras = async (req, res) => {
    try {
        
        const result = await pool.query(
            `SELECT c.*, u.email, e.nombre AS evento_nombre 
             FROM compras c 
             JOIN cartelera e ON c.cartelera_id = e.id
             JOIN users u ON c.user_id = u.id`
        );

        console.log("Datos obtenidos del backend:", result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error("Error en la consulta:", error);
        res.status(500).json({ message: "Error al obtener todas las compras." });

    }
};
module.exports = {
    obtenerComprasUsuario,
    obtenerTodasLasCompras,
    
};

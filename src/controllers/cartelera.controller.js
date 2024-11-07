const pool = require('../db');

// Obtener un evento específico de la cartelera
const getCartelera = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`
            SELECT c.*, s.nombre AS sala_nombre, s.imagen_url AS sala_imagen_url
            FROM cartelera c
            LEFT JOIN sala s ON c.sala_id = s.id
            WHERE c.id = $1
        `, [id]);

        if (result.rows.length === 0)
            return res.status(404).json({
                message: "El evento no se encuentra",
            });

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

// Obtener todos los eventos de la cartelera
const getAllCartelera = async (req, res, next) => {
    try {
        const result = await pool.query(`
            SELECT c.*, s.nombre AS sala_nombre, s.imagen_url AS sala_imagen_url
            FROM cartelera c
            LEFT JOIN sala s ON c.sala_id = s.id
        `);
        console.log(result.rows);
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

// Crear un nuevo evento en la cartelera
const createCartelera = async (req, res, next) => {
    const { nombre, categoria, descripcion, fecha, fecha_inicio, fecha_final, sala_id } = req.body;
    console.log("Datos recibidos:", req.body);

    // Validación básica
    if (!nombre || !categoria || !descripcion || !fecha || !sala_id) {
        return res.status(400).json({ message: "Faltan campos requeridos." });
    }

    try {
        const imagen_url = req.file ? `/uploads/${req.file.filename}` : null;

        const result = await pool.query(
            `INSERT INTO cartelera (nombre, categoria, descripcion, fecha, fecha_inicio, fecha_final, imagen_url, sala_id) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [nombre, categoria, descripcion, fecha, fecha_inicio, fecha_final, imagen_url, sala_id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error al crear cartelera:", error);
        next(error);
    }
};

// Eliminar un evento de la cartelera
const deleteCartelera = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM cartelera WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "El evento no se encuentra",
            });
        }

        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

// Actualizar un evento existente en la cartelera
const updateCartelera = async (req, res, next) => {
    try {
        console.log("Body recibido:", req.body);
        console.log("Archivo recibido:", req.file);

        const { id } = req.params;
        const { nombre, categoria, descripcion, fecha, fecha_inicio, fecha_final, sala_id, imagen_url } = req.body;

        // Si hay un archivo nuevo, usa su URL; de lo contrario, mantiene la URL existente de la imagen
        const newImagenUrl = req.file ? `/uploads/${req.file.filename}` : imagen_url;

        const result = await pool.query(
            `UPDATE cartelera 
            SET nombre = $1, categoria = $2, descripcion = $3, fecha = $4, fecha_inicio = $5, fecha_final = $6, imagen_url = $7, sala_id = $8 
            WHERE id = $9 RETURNING *`,
            [nombre, categoria, descripcion, fecha, fecha_inicio, fecha_final, newImagenUrl, sala_id, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "El evento no se encuentra",
            });
        }

        return res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};


module.exports = {
    getCartelera,
    getAllCartelera,
    createCartelera,
    deleteCartelera,
    updateCartelera
};

const pool = require('../db');

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

const createCartelera = async (req, res, next) => {
    const { nombre, categoria, fecha_inicio, fecha_final, imagen_url, sala_id } = req.body; 
    console.log("Datos recibidos:", req.body);// ahora usamos fecha_rango
    try {
        const result = await pool.query(
            "INSERT INTO cartelera (nombre, categoria, fecha_inicio, fecha_final, imagen_url, sala_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [nombre, categoria, fecha_inicio, fecha_final, imagen_url, sala_id]
        );

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error al crear cartelera:", error);
        next(error);
    }
};

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

const updateCartelera = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nombre, categoria, fecha_inicio, fecha_final, imagen_url, sala_id } = req.body; // ahora usamos fecha_rango
        const result = await pool.query(
            "UPDATE cartelera SET nombre = $1, categoria = $2, fecha_inicio = $3, fecha_final = $4, imagen_url = $5, sala_id = $6 WHERE id = $7 RETURNING *",
            [nombre, categoria, fecha_inicio, fecha_final, imagen_url, sala_id, id]
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

const pool = require('../db');
//Obtener una sala en especifico
const getSala = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM sala WHERE id = $1', [id]);

        if (result.rows.length === 0)
            return res.status(404).json({
                message: "La sala no se encuentra",
            });

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};
//Obtener todas las salas
const getAllSala = async (req, res, next) => {
    try {
        const result = await pool.query('SELECT * FROM sala');
        console.log(result.rows);
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};
//Crear sala
const createSala = async (req, res, next) => {
    const { nombre, imagen_url, capacidad } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO sala (nombre, imagen_url, capacidad) VALUES ($1, $2, $3) RETURNING *",
            [nombre, imagen_url, capacidad]
        );

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};
//Eliminar sala
const deleteSala = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM sala WHERE id = $1', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "La sala no se encuentra",
            });
        }

        return res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
//Actualizar sala
const updateSala = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nombre, imagen_url, capacidad } = req.body;
        const result = await pool.query(
            "UPDATE sala SET nombre = $1, imagen_url = $2, capacidad = $3 WHERE id = $4 RETURNING *",
            [nombre, imagen_url, capacidad, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "La sala no se encuentra",
            });
        }

        return res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSala,
    getAllSala,
    createSala,
    deleteSala,
    updateSala
};

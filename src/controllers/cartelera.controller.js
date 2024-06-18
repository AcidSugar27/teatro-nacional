const pool = require('../db');

const getCartelera = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM cartelera WHERE id = $1', [id]);

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
        const result = await pool.query('SELECT * FROM cartelera');
        console.log(result.rows);
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

const createCartelera = async (req, res, next) => {
    const { nombre, categoria, fecha, hora_inicio, hora_final, imagen_url } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO cartelera (nombre, categoria, fecha, hora_inicio, hora_final, imagen_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [nombre, categoria, fecha, hora_inicio, hora_final, imagen_url]
        );

        res.json(result.rows[0]);
    } catch (error) {
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
        const { nombre, categoria, fecha, hora_inicio, hora_final, imagen_url } = req.body;
        const result = await pool.query(
            "UPDATE cartelera SET nombre = $1, categoria = $2, fecha = $3, hora_inicio = $4, hora_final = $5, imagen_url = $6 WHERE id = $7 RETURNING *",
            [nombre, categoria, fecha, hora_inicio, hora_final, imagen_url, id]
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

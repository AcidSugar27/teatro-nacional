
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db'); 


const registrar = async (req, res) => {
    const { username, password, email, rol } = req.body;
    try {
        // Hash del password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Inserta el usuario en la base de datos
        const newUser = await pool.query(
            'INSERT INTO users (username, password, email, rol) VALUES ($1, $2, $3, $4) RETURNING *',
            [username, hashedPassword, email, rol]
        );
        // Genera el token de autenticación
        const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
};


const loguear = async (req, res) => {
    const { username, password } = req.body;
    try {
        
        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        if (user.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = { registrar, loguear };

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const pool = require('../db');

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'eliasamarante27@gmail.com',
        pass: 'mlck cszc tkxs uymt'
    }
});

const sendVerificationEmail = (user, token) => {
    const verificationUrl = `http://localhost:3000/verify-email?token=${token}`;
    const mailOptions = {
        from: 'eliasamarante27@gmail.com',
        to: user.email,
        subject: 'Email Verification',
        text: `Please verify your email by clicking the following link: ${verificationUrl}`,
        html: `<a href="${verificationUrl}">Verify Email</a>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

const registrar = async (req, res) => {
    const { nombre, apellido, password, email, rol } = req.body;
    try {
        // Hash del password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Genera el token de verificación
        const verificationToken = crypto.randomBytes(32).toString('hex');
        
        // Inserta el usuario en la base de datos
        const newUser = await pool.query(
            'INSERT INTO users (nombre, apellido, password, email, rol, verification_token) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [nombre, apellido, hashedPassword, email, rol, verificationToken]
        );
        
        // Enviar el correo de verificación
        sendVerificationEmail(newUser.rows[0], verificationToken);
        
        // Genera el token de autenticación
        const token = jwt.sign({ id: newUser.rows[0].id, rol: newUser.rows[0].rol }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

const loguear = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ id: user.rows[0].id, rol: user.rows[0].rol }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

const verificarEmail = async (req, res) => {
    const { token } = req.query;
    try {
        const result = await pool.query(
            'UPDATE users SET email_verified = TRUE, verification_token = NULL WHERE verification_token = $1 RETURNING *',
            [token]
        );
        
        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid or already used token' });
        }
        
        res.json({ message: 'Email successfully verified' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

const getUserData = async (req, res) => {
    try {
        // Obtener el ID del usuario desde el token de autenticación
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Consultar la base de datos para obtener los datos del usuario
        const user = await pool.query('SELECT nombre, apellido, email, rol FROM users WHERE id = $1', [userId]);
        
        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(user.rows[0]);  // Devolver los datos del usuario
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

module.exports = { registrar, loguear, verificarEmail, getUserData };

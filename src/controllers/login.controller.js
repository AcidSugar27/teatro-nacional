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
        pass: 'epnd ctfg euil nnpu'
    }
});
//ENVIAR LA VERIFICACION DEL CORREO
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
//registrar el usuario con el nombre, apellido, contraseña, email y rol
const registrar = async (req, res) => {
    const { nombre, apellido, password, email, rol } = req.body;
    try {
        if (!nombre || !apellido || !password || !email) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios' });
        }

        const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const verificationToken = crypto.randomBytes(32).toString('hex');
        
        const newUser = await pool.query(
            'INSERT INTO users (nombre, apellido, password, email, rol, verification_token) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [nombre, apellido, hashedPassword, email, rol, verificationToken]
        );
        
        sendVerificationEmail(newUser.rows[0], verificationToken);
        
        const token = jwt.sign({ id: newUser.rows[0].id, rol: newUser.rows[0].rol }, process.env.JWT_SECRET);
        res.status(201).json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error del servidor' });
    }
};
//iniciar sesion con el email y la contraseña
const loguear = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ error: 'Por favor, ingrese email y contraseña' });
        }

        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        if (!user.rows[0].email_verified) {
            return res.status(403).json({ error: 'Verifique su email antes de iniciar sesión' });
        }
        
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        
        const token = jwt.sign({ id: user.rows[0].id, rol: user.rows[0].rol }, process.env.JWT_SECRET);
        res.json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

//verificar el correo del usuario para poder iniciar sesion
const verificarEmail = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ error: 'Token is missing' });
    }

    try {
        
        const result = await pool.query(
            'UPDATE users SET email_verified = TRUE, verification_token = NULL WHERE verification_token = $1 AND email_verified = FALSE RETURNING *',
            [token]
        );

        if (result.rows.length === 0) {
            
            const checkToken = await pool.query(
                'SELECT * FROM users WHERE verification_token = $1',
                [token]
            );

            if (checkToken.rows.length === 0) {
                return res.status(400).json({ error: 'Invalid token' });
            } else {
                return res.status(400).json({ error: 'Token already used or email already verified' });
            }
        }
        
        res.json({ message: 'Email successfully verified' });
    } catch (error) {
        console.error('Error verifying email:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

const getUserData = async (req, res) => {
    try {
        
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

       
        const user = await pool.query('SELECT nombre, apellido, email, rol FROM users WHERE id = $1', [userId]);
        
        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(user.rows[0]);  
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'No se encontró una cuenta con ese email' });
        }

        const user = userResult.rows[0]; 
        const resetToken = crypto.randomBytes(32).toString('hex');

        await pool.query(
            'UPDATE users SET reset_password_token = $1 WHERE email = $2',
            [resetToken, email]
        );

        const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;
        const mailOptions = {
            from: 'eliasamarante27@gmail.com',
            to: email,
            subject: 'Recuperación de Contraseña',
            text: `Para restablecer su contraseña, haga clic en el siguiente enlace: ${resetUrl}`,
            html: `<a href="${resetUrl}">Restablecer Contraseña</a>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error enviando correo:', error);
                return res.status(500).json({ error: 'Error al enviar el correo de recuperación' });
            } else {
                console.log('Correo enviado:', info.response);
                return res.status(200).json({ message: 'Correo de recuperación enviado' });
            }
        });
    } catch (error) {
        console.error('Error del servidor:', error);
        return res.status(500).json({ error: 'Error del servidor' });
    }
};


const resetPassword = async (req, res) => {
    const { token } = req.query; 
    const { newPassword } = req.body;

    try {
       
        const userResult = await pool.query(
            'SELECT * FROM users WHERE reset_password_token = $1',
            [token]
        );

        
        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: 'Token inválido' });
        }

        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        
        await pool.query(
            'UPDATE users SET password = $1, reset_password_token = NULL WHERE id = $2',
            [hashedPassword, userResult.rows[0].id]
        );

        
        res.json({ message: 'Contraseña restablecida exitosamente' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: 'Error del servidor' });
    }
};


module.exports = { registrar, loguear, verificarEmail, getUserData, resetPassword, forgotPassword };

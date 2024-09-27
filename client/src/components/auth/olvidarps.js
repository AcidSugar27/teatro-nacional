import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Grid, Paper } from '@mui/material';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleForgotPassword = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await fetch('http://localhost:4000/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Correo de recuperación enviado. Por favor, revisa tu bandeja de entrada.');
            } else {
                setError(data.error || 'Error al enviar el correo de recuperación');
            }
        } catch (error) {
            console.error('Error de red:', error);
            setError('Error de conexión. Por favor, intente de nuevo.');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '80vh' }}>
                <Grid item xs={8} sm={10} md={20}>
                    <Paper elevation={3} style={{ padding: '30px', backgroundColor: 'white' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography component="h1" variant="h5">
                                Recuperar Contraseña
                            </Typography>
                            <Box component="form" onSubmit={handleForgotPassword} sx={{ mt: 3 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Correo Electrónico"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoFocus
                                />
                                {error && <Typography color="error" align="center">{error}</Typography>}
                                {message && <Typography color="success" align="center">{message}</Typography>}
                                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                                    Enviar Correo de Recuperación
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ForgotPassword;

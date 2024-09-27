import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Grid, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Hook para redirigir

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verificar que las contraseñas coincidan
        if (newPassword !== confirmPassword) {
            return setMessage('Las contraseñas no coinciden');
        }

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        try {
            const response = await fetch(`http://localhost:4000/reset-password?token=${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Contraseña restablecida exitosamente');
                // Redirigir al login después de un breve retraso
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setMessage(data.error || 'Error al restablecer la contraseña');
            }
        } catch (error) {
            console.error('Error:', error);
            setMessage('Error al restablecer la contraseña');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '80vh' }}>
                <Grid item xs={12} sm={8} md={12}>
                    <Paper elevation={3} style={{ padding: '20px', backgroundColor: 'white' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography component="h1" variant="h5">
                                Restablecer Contraseña
                            </Typography>
                            {message && <Typography color="error" align="center" sx={{ mt: 2 }}>{message}</Typography>}
                            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Nueva Contraseña"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    label="Confirmar Nueva Contraseña"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Restablecer Contraseña
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default ResetPassword;

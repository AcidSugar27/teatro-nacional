import React, { useState, useEffect } from 'react';
import { AppBar, Button, Container, Toolbar, Typography, Box, MenuItem, Select } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:4000/user', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                setNombre(data.nombre);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setNombre(null);
        navigate('/login');
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color="transparent">
                <Container>
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            <Link to="/" style={{ textDecoration: 'none', color: '#eee' }}>TEATRO NACIONAL</Link>
                        </Typography>

                        <Select
                            value=""
                            displayEmpty
                            style={{ marginRight: '10px' }}
                            onChange={(e) => navigate(`/${e.target.value}`)}
                        >
                            <MenuItem value="" disabled>
                                Opciones
                            </MenuItem>
                            <MenuItem value="cartelera/new">Agregar a Cartelera</MenuItem>
                            <MenuItem value="sala/new">Agregar Sala</MenuItem>
                            <MenuItem value="salas">Ver Salas</MenuItem>
                        </Select>

                        {nombre ? (
                            <>
                                <Typography variant="body1" sx={{ marginRight: '10px' }}>
                                    Bienvenido, {nombre}
                                </Typography>
                                <Button color="inherit" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button color="inherit" component={Link} to="/login">
                                    Login
                                </Button>
                                <Button color="inherit" component={Link} to="/register">
                                    Register
                                </Button>
                            </>
                        )}

                    </Toolbar>
                </Container>
            </AppBar>
        </Box>
    );
}

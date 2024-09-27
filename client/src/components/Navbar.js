import React, { useState, useEffect } from 'react';
import { AppBar, Button, Container, Toolbar, Typography, Box, MenuItem, Select, IconButton, Menu } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default function Navbar() {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); 

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

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color="transparent">
                <Container>
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            <Link to="/" style={{ textDecoration: 'none', color: '#eee' }}>TEATRO NACIONAL</Link>
                        </Typography>

                        {isMobile ? (
                            <>
                                <IconButton
                                    edge="start"
                                    color="inherit"
                                    aria-label="menu"
                                    onClick={handleMenuClick}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                >
                                    <MenuItem onClick={() => { handleMenuClose(); navigate('/cartelera/new'); }}>Agregar a Cartelera</MenuItem>
                                    <MenuItem onClick={() => { handleMenuClose(); navigate('/sala/new'); }}>Agregar Sala</MenuItem>
                                    <MenuItem onClick={() => { handleMenuClose(); navigate('/salas'); }}>Ver Salas</MenuItem>
                                </Menu>
                            </>
                        ) : (
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
                        )}

                        {nombre ? (
                            <>
                                <Typography variant="body1" sx={{ marginRight: '8px' }}>
                                    Bienvenido, {nombre} 
                                </Typography>
                                <Button color="inherit" onClick={handleLogout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button color="inherit" component={Link} to="/login">
                                    Iniciar sesión
                                </Button>
                                <Button color="inherit" component={Link} to="/register">
                                    Registrarse
                                </Button>
                            </>
                        )}

                    </Toolbar>
                </Container>
            </AppBar>
        </Box>
    );
}

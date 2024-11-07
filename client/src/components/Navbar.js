import React, { useState, useEffect } from 'react';
import { AppBar, Button, Container, Toolbar, Typography, Box, MenuItem, Select, IconButton, Menu } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default function Navbar() {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState(null);
    const [role, setRole] = useState(null);
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
                setRole(data.rol); 
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
        <Box sx={{ flexGrow: 1}}>
            <AppBar position="static" sx={{backgroundColor:'black'}}>
                <Container >
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            <Link to="/" style={{ textDecoration: 'none', color: '#eee' }}>TEATRO NACIONAL</Link>
                        </Typography>

                        {isMobile ? (
                            <>
                                {role === 'admin' && (
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
                                )}
                            </>
                        ) : (
                            <>
                                {role === 'admin' && (
                                    <Select
                                        value=""
                                        displayEmpty
                                        style={{ marginRight: '20px', backgroundColor:'white', width: '120px',height: '42px',   }}
                                        onChange={(e) => navigate(`/${e.target.value}`)}
                                    >
                                        <MenuItem value="" disabled sx={{backgroundColor:'black' }}>
                                            Opciones
                                        </MenuItem>
                                        <MenuItem value="cartelera/new">Agregar a Cartelera</MenuItem>
                                        <MenuItem value="sala/new">Agregar Sala</MenuItem>
                                        <MenuItem value="salas">Ver Salas</MenuItem>
                                    </Select>
                                )}
                            </>
                        )}

                        {nombre ? (
                            <>
                                <Typography variant="body1" sx={{ marginRight: '20px' }}>
                                    Bienvenido, {nombre} 
                                </Typography>
                                <Button color="error" sx={{backgroundColor:'white'}} onClick={handleLogout}>
                                    Desloguearse
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

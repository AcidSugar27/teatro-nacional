import React, { useEffect, useState } from 'react';
import { Typography, Card, CardContent, Button, Grid, CardMedia } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function SalaList() {
    const [salas, setSalas] = useState([]);
    const [userRole, setUserRole] = useState(null); 
    const navigate = useNavigate();

    const loadSalas = async () => {
        const response = await fetch('http://localhost:4000/sala');
        const data = await response.json();
        setSalas(data);
    };

   
    const fetchUserRole = () => {
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
                setUserRole(data.rol); 
            })
            .catch(error => {
                console.error('Error fetching user role:', error);
            });
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await fetch(`http://localhost:4000/sala/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                throw new Error('Error deleting the sala');
            }

            setSalas(salas.filter((sala) => sala.id !== id));
        } catch (error) {
            console.error('Failed to delete the sala:', error);
        }
    };

    useEffect(() => {
        loadSalas();
        fetchUserRole(); 
    }, []);

    return (
        <Grid container spacing={2}>
            {salas.map((sala) => (
                <Grid item xs={12} sm={6} md={4} key={sala.id}>
                    <Card style={{ marginBottom: '.7rem', backgroundColor: 'white' }}>
                        <CardMedia
                            component="img"
                            alt={sala.nombre}
                            height="250"
                            image={sala.imagen_url}
                            title={sala.nombre}
                            sx={{
                                objectFit: 'fill'
                            }}
                        />
                        <CardContent style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <Typography variant="h5">{sala.nombre}</Typography>
                                <Typography variant="h5">Capacidad:{sala.capacidad}</Typography>
                            </div>
                            {userRole === 'admin' && ( 
                                <div>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => navigate(`/sala/${sala.id}/edit`)}
                                        style={{ marginLeft: '1.5rem',marginBottom:'0.5rem' }}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleDelete(sala.id)}
                                        style={{ marginLeft: '1.5rem' }}
                                    >
                                        Eliminar
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

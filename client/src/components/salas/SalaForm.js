import React, { useState, useEffect } from 'react';
import { Button, CardContent, CircularProgress, Grid, TextField, Card, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

export default function SalaForm() {
    const [sala, setSala] = useState({
        nombre: '',
        imagen_url: '',
        capacidad: ''
    });

    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);

    const navigate = useNavigate();
    const params = useParams();

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);

        if (editing) {
            const res = await fetch(`http://localhost:4000/sala/${params.id}`, {
                method: 'PUT',
                body: JSON.stringify(sala),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            console.log(data);
        } else {
            await fetch('http://localhost:4000/sala', {
                method: 'POST',
                body: JSON.stringify(sala),
                headers: { 'Content-Type': 'application/json' }
            });
        }

        setLoading(false);
        navigate('/salas');
    };

    const handleChange = e => {
        setSala({ ...sala, [e.target.name]: e.target.value });
    };

    const loadSala = async id => {
        const res = await fetch(`http://localhost:4000/sala/${id}`);
        const data = await res.json();
        setSala({
            nombre: data.nombre,
            imagen_url: data.imagen_url,
            capacidad: data.capacidad
        });
        setEditing(true);
    };

    useEffect(() => {
        if (params.id) {
            loadSala(params.id);
        }
    }, [params.id]);

    return (
        <Grid container direction="column" alignItems="center" justifyContent="center">
            <Grid item xs={3}>
                <Card sx={{ mt: 5 }} style={{ backgroundColor: '#e272e', padding: '1rem' }}>
                    <Typography variant="h5" textAlign="center" color="blue">
                        {editing ? 'Editar Sala' : 'Crear Sala'}
                    </Typography>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                variant="filled"
                                value={sala.nombre}
                                label="Nombre de la Sala"
                                sx={{ display: 'block', margin: '.5rem 0' }}
                                name="nombre"
                                onChange={handleChange}
                                inputProps={{ style: { color: 'black' } }}
                            />
                            <TextField
                                variant="filled"
                                value={sala.imagen_url}
                                label="URL de la Imagen"
                                sx={{ display: 'block', margin: '.5rem 0' }}
                                name="imagen_url"
                                onChange={handleChange}
                                inputProps={{ style: { color: 'black' } }}
                            />
                            <TextField
                                variant="filled"
                                value={sala.capacidad}
                                label="Capacidad de la sala"
                                sx={{ display: 'block', margin: '.5rem 0' }}
                                name="capacidad"
                                onChange={handleChange}
                                inputProps={{ style: { color: 'black' } }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={!sala.nombre || !sala.imagen_url || !sala.capacidad}
                            >
                                {loading ? <CircularProgress color="inherit" size={24} /> : editing ? 'Actualizar Sala' : 'Crear Sala'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}

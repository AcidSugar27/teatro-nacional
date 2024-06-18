import React, { useState, useEffect } from 'react'
import {Button, CardContent, CircularProgress, Grid, TextField} from '@mui/material'
import { Card, Typography } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'

export default function CarteleraForm() {

    const [cartelera, setCartelera] = useState({
      nombre: '',
      categoria: '',
      fecha: '',
      hora_inicio: '',
      hora_final: '',
      imagen_url: ''
    });
  
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
  
    const navigate = useNavigate();
    const params = useParams();
  
    const handleSubmit = async e => {
      e.preventDefault();
      setLoading(true);
  
      if (editing) {
        const res = await fetch(`http://localhost:4000/cartelera/${params.id}`, {
          method: 'PUT',
          body: JSON.stringify(cartelera),
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        console.log(data);
      } else {
        await fetch('http://localhost:4000/cartelera', {
          method: 'POST',
          body: JSON.stringify(cartelera),
          headers: { 'Content-Type': 'application/json' },
        });
      }
  
      setLoading(false);
      navigate('/');
    };
  
    const handleChange = e => {
      setCartelera({ ...cartelera, [e.target.name]: e.target.value });
    };
  
    const loadCartelera = async id => {
      const res = await fetch(`http://localhost:4000/cartelera/${id}`);
      const data = await res.json();
      setCartelera({
        nombre: data.nombre,
        categoria: data.categoria,
        fecha: data.fecha,
        hora_inicio: data.hora_inicio,
        hora_final: data.hora_final,
        imagen_url: data.imagen_url
      });
      setEditing(true);
    };
  
    useEffect(() => {
      if (params.id) {
        loadCartelera(params.id);
      }
    }, [params.id]);
  
    return (
      <Grid container direction='column' alignItems='center' justifyContent='center'>
        <Grid item xs={3}>
          <Card sx={{ mt: 5 }} style={{ backgroundColor: '#e272e', padding: '1rem' }}>
            <Typography variant='h5' textAlign='center' color="blue">
              {editing ? 'Editar evento' : 'Crear evento'}
            </Typography>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <TextField
                  variant='filled'
                  value={cartelera.nombre}
                  label='Nombre del evento'
                  sx={{ display: 'block', margin: '.5rem 0' }}
                  name='nombre'
                  onChange={handleChange}
                  inputProps={{ style: { color: 'black' } }}
                />
                <TextField
                  variant='filled'
                  value={cartelera.categoria}
                  label='Categoría'
                  sx={{ display: 'block', margin: '.5rem 0' }}
                  name='categoria'
                  onChange={handleChange}
                  inputProps={{ style: { color: 'black' } }}
                />
                <TextField
                  variant='filled'
                  value={cartelera.fecha}
                  label='Fecha'
                  sx={{ display: 'block', margin: '.5rem 0' }}
                  name='fecha'
                  onChange={handleChange}
                  inputProps={{ style: { color: 'black' } }}
                />
                <TextField
                  variant='filled'
                  value={cartelera.hora_inicio}
                  label='Hora de inicio'
                  sx={{ display: 'block', margin: '.5rem 0' }}
                  name='hora_inicio'
                  onChange={handleChange}
                  inputProps={{ style: { color: 'black' } }}
                />
                <TextField
                  variant='filled'
                  value={cartelera.hora_final}
                  label='Hora de finalización'
                  sx={{ display: 'block', margin: '.5rem 0' }}
                  name='hora_final'
                  onChange={handleChange}
                  inputProps={{ style: { color: 'black' } }}
                />
                <TextField
                  variant='filled'
                  value={cartelera.imagen_url}
                  label='URL de la imagen'
                  sx={{ display: 'block', margin: '.5rem 0' }}
                  name='imagen_url'
                  onChange={handleChange}
                  inputProps={{ style: { color: 'black' } }}
                />
                <Button
                  variant='contained'
                  color='primary'
                  type='submit'
                  disabled={
                    !cartelera.nombre ||
                    !cartelera.categoria ||
                    !cartelera.fecha ||
                    !cartelera.hora_inicio ||
                    !cartelera.hora_final ||
                    !cartelera.imagen_url
                  }
                >
                  {loading ? <CircularProgress color='inherit' size={24} /> : editing ? 'Actualizar evento' : 'Crear evento'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
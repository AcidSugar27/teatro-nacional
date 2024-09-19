import React, { useState, useEffect } from 'react';
import { Button, CardContent, CircularProgress, Grid, TextField } from '@mui/material';
import { Card, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function CarteleraForm() {
  const [cartelera, setCartelera] = useState({
    nombre: '',
    categoria: '',
    fecha_inicio: dayjs(),  // Initial date
    fecha_final: dayjs(),     // Initial date
    imagen_url: '',
    sala_id: ''
  });

  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const navigate = useNavigate();
  const params = useParams();

  const fetchSalas = async () => {
    const response = await fetch('http://localhost:4000/sala');
    const data = await response.json();
    setSalas(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Verifica si las fechas son válidas antes de convertir
    if (!cartelera.fecha_inicio.isValid() || !cartelera.fecha_final.isValid()) {
      console.error("Fechas inválidas:", cartelera.fecha_inicio, cartelera.fecha_final);
      setLoading(false);
      return;
    }

    const payload = {
      ...cartelera,
      fecha_inicio: cartelera.fecha_inicio.toISOString(),
      fecha_final: cartelera.fecha_final.toISOString()
    };

    try {
      const url = editing
        ? `http://localhost:4000/cartelera/${params.id}`
        : 'http://localhost:4000/cartelera';

      const response = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setLoading(false);
      navigate('/');
    } catch (error) {
      console.error('Error al guardar cartelera:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCartelera({ ...cartelera, [e.target.name]: e.target.value });
  };

  const handleDateChange = (name, newValue) => {
    setCartelera({ ...cartelera, [name]: newValue });
  };

  const loadCartelera = async (id) => {
    const res = await fetch(`http://localhost:4000/cartelera/${id}`);
    const data = await res.json();
    setCartelera({
      nombre: data.nombre,
      categoria: data.categoria,
      fecha_inicio: dayjs(data.fecha_inicio),  // Load start date with Dayjs
      fecha_final: dayjs(data.fecha_final),        // Load end date with Dayjs
      imagen_url: data.imagen_url,
      sala_id: data.sala_id,
    });
    setEditing(true);
  };

  useEffect(() => {
    fetchSalas();
    if (params.id) {
      loadCartelera(params.id);
    }
  }, [params.id]);

  return (
    <Grid container direction='column' alignItems='center' justifyContent='center'>
      <Grid item xs={12} sm={8} md={6}>
        <Card sx={{ mt: 5 }} style={{ backgroundColor: '#f5f5f5', padding: '1rem' }}>
          <Typography variant='h5' textAlign='center' color='blue'>
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
              {/* DateTimePicker for start and end date */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <DateTimePicker
                      label="Fecha de inicio"
                      value={cartelera.fecha_inicio}
                      onChange={(newValue) => handleDateChange('fecha_inicio', newValue)}
                      renderInput={(params) => <TextField {...params} sx={{ display: 'block', margin: '.5rem 0' }} />}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DateTimePicker
                      label="Fecha final"
                      value={cartelera.fecha_final}
                      onChange={(newValue) => handleDateChange('fecha_final', newValue)}
                      renderInput={(params) => <TextField {...params} sx={{ display: 'block', margin: '.5rem 0' }} />}
                    />
                  </Grid>
                </Grid>
              </LocalizationProvider>
              <TextField
                variant='filled'
                value={cartelera.imagen_url}
                label='URL de la imagen'
                sx={{ display: 'block', margin: '.5rem 0' }}
                name='imagen_url'
                onChange={handleChange}
                inputProps={{ style: { color: 'black' } }}
              />
              <TextField
                select
                label='Sala'
                name='sala_id'
                value={cartelera.sala_id}
                onChange={handleChange}
                SelectProps={{
                  native: true,
                }}
                sx={{ display: 'block', margin: '.5rem 0' }}
              >
                <option value=''></option>
                {salas.map((sala) => (
                  <option key={sala.id} value={sala.id}>
                    {sala.nombre}
                  </option>
                ))}
              </TextField>
              <Button
                variant='contained'
                color='primary'
                type='submit'
                disabled={
                  !cartelera.nombre ||
                  !cartelera.categoria ||
                  !cartelera.fecha_inicio ||
                  !cartelera.fecha_final ||
                  !cartelera.imagen_url ||
                  !cartelera.sala_id
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

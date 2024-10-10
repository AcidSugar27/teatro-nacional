import React, { useState, useEffect } from 'react';
import { Button, CardContent, CircularProgress, Grid, TextField, IconButton } from '@mui/material';
import { Card, Typography, MenuItem } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import CloseIcon from '@mui/icons-material/Close';

export default function CarteleraForm() {
  const [cartelera, setCartelera] = useState({
    nombre: '',
    categoria: '',
    fecha: new Date(), // Guarda el día, mes, y año
    fecha_inicio: new Date(), // Guarda solo la hora de inicio
    fecha_final: new Date(), // Guarda solo la hora de finalización
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

    // Convertimos las fechas y horas al formato deseado
    const payload = {
      ...cartelera,
      fecha: cartelera.fecha.toISOString().split('T')[0], // Solo guarda la fecha (año-mes-día)
      fecha_inicio: cartelera.fecha_inicio.toTimeString().split(' ')[0], // Solo guarda la hora de inicio (HH:mm:ss)
      fecha_final: cartelera.fecha_final.toTimeString().split(' ')[0] // Solo guarda la hora final (HH:mm:ss)
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
      fecha: new Date(data.fecha), // Cargamos la fecha
      fecha_inicio: new Date(`1970-01-01T${data.fecha_inicio}`), // Cargamos solo la hora de inicio
      fecha_final: new Date(`1970-01-01T${data.fecha_final}`), // Cargamos solo la hora final
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
    <Grid container direction='column' alignItems='center' justifyContent='center' style={{ minHeight: '100vh' }}>
      <Grid item xs={12} sm={8} md={6}>
        <Card sx={{ mt: -10, position: 'relative' }} style={{ backgroundColor: '#f5f5f5', padding: '1rem' }}>
          
          <IconButton 
            aria-label="cancel" 
            sx={{ position: 'absolute', top: 8, left: 8, color: 'red' }} 
            onClick={() => navigate('/')}
          >
            <CloseIcon />
          </IconButton>
          
          <Typography variant='h5' textAlign='center' color='black'>
            {editing ? 'Editar Cartelera' : 'Agregar Cartelera'}
          </Typography>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <TextField
                variant='filled'
                value={cartelera.nombre}
                label='Nombre de la cartelera'
                sx={{ display: 'block', margin: '1rem 0' }}
                name='nombre'
                onChange={handleChange}
                inputProps={{ style: { color: 'black' } }}
                fullWidth
              />
              
              <TextField
                select
                variant='filled'
                value={cartelera.categoria}
                label='Categoría'
                sx={{ display: 'block', margin: '1rem 0' }}
                name='categoria'
                onChange={handleChange}
                inputProps={{ style: { color: 'black' } }}
                fullWidth
              >
                <MenuItem value="Teatro">Teatro</MenuItem>
                <MenuItem value="Danza">Danza</MenuItem>
                <MenuItem value="Opera">Opera</MenuItem>
                <MenuItem value="Obra">Obra</MenuItem>
              </TextField>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={2}>
                  {/* Campo de fecha */}
                  <Grid item xs={12}>
                    <DatePicker
                      label="Fecha"
                      value={cartelera.fecha}
                      onChange={(newValue) => handleDateChange('fecha', newValue)}
                      renderInput={(params) => <TextField {...params} sx={{ display: 'block', margin: '.5rem 0' }} />}
                    />
                  </Grid>

                  {/* Campo de hora de inicio */}
                  <Grid item xs={12} sm={6}>
                    <TimePicker
                      label="Hora de inicio"
                      value={cartelera.fecha_inicio}
                      onChange={(newValue) => handleDateChange('fecha_inicio', newValue)}
                      renderInput={(params) => <TextField {...params} sx={{ display: 'block', margin: '.5rem 0' }} />}
                    />
                  </Grid>

                  {/* Campo de hora final */}
                  <Grid item xs={12} sm={6}>
                    <TimePicker
                      label="Hora final"
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
                sx={{ display: 'block', margin: '1rem 0' }}
                name='imagen_url'
                onChange={handleChange}
                inputProps={{ style: { color: 'black' } }}
                fullWidth
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
                sx={{ display: 'block', margin: '1rem 0' }}
                fullWidth
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
                  !cartelera.fecha ||
                  !cartelera.fecha_inicio ||
                  !cartelera.fecha_final ||
                  !cartelera.imagen_url ||
                  !cartelera.sala_id
                }
                fullWidth
                sx={{ mt: 2 }}
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

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
    fecha: new Date(),
    fecha_inicio: new Date(), 
    fecha_final: new Date(), 
    imagen_url: '',
    sala_id: '',
    precio_ticket: ''
  });

  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [file, setFile] = useState(null);
  const [userRole, setUserRole] = useState(null);
  

  const navigate = useNavigate();
  const params = useParams();

  const fetchSalas = async () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = new FormData();
    payload.append('nombre', cartelera.nombre);
    payload.append('categoria', cartelera.categoria);
    payload.append('descripcion', cartelera.descripcion);
    payload.append('fecha', cartelera.fecha.toISOString().split('T')[0]);
    payload.append('fecha_inicio', cartelera.fecha_inicio.toTimeString().split(' ')[0]);
    payload.append('fecha_final', cartelera.fecha_final.toTimeString().split(' ')[0]);
    payload.append('sala_id', cartelera.sala_id);
    payload.append('precio_ticket', cartelera.precio_ticket);

    if (file) {
      payload.append('imagen_url', file);
    } else {
     
      payload.append('imagen_url', cartelera.imagen_url);
    }

    try {
      const url = editing
        ? `http://localhost:4000/cartelera/${params.id}`
        : 'http://localhost:4000/cartelera';

      const response = await fetch(url, {
        method: editing ? 'PUT' : 'POST',
        body: payload,
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

  useEffect(() => {
    if (userRole && userRole !== 'admin') {
      alert('No tienes permiso para acceder a esta página');
      navigate('/');
    }
  }, [userRole, navigate]);

  const loadCartelera = async (id) => {
    const res = await fetch(`http://localhost:4000/cartelera/${id}`);
    const data = await res.json();
    setCartelera({
      nombre: data.nombre,
      categoria: data.categoria,
      descripcion: data.descripcion,
      fecha: new Date(data.fecha), 
      fecha_inicio: new Date(`2024-01-01T${data.fecha_inicio}`), 
      fecha_final: new Date(`2024-01-01T${data.fecha_final}`), 
      imagen_url: data.imagen_url,
      sala_id: data.sala_id,
      precio_ticket: data.precio_ticket
    });
    setEditing(true);
  };

  useEffect(() => {
    fetchSalas();
    fetchUserRole();
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
                variant='filled'
                multiline
                rows={4}
                value={cartelera.descripcion}
                label='Descripción'
                sx={{ display: 'block', margin: '1rem 0' }}
                name='descripcion'
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
                 
                  <Grid item xs={12}>
                    <DatePicker
                      label="Fecha"
                      value={cartelera.fecha}
                      onChange={(newValue) => handleDateChange('fecha', newValue)}
                      renderInput={(params) => <TextField {...params} sx={{ display: 'block', margin: '.5rem 0' }} />}
                    />
                  </Grid>

                 
                  <Grid item xs={12} sm={6}>
                    <TimePicker
                      label="Hora de inicio"
                      value={cartelera.fecha_inicio}
                      onChange={(newValue) => handleDateChange('fecha_inicio', newValue)}
                      renderInput={(params) => <TextField {...params} sx={{ display: 'block', margin: '.5rem 0' }} />}
                    />
                  </Grid>

                  
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

              <input
                accept="image/*"
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                style={{ display: 'block', margin: '1rem 0' }}
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

              <TextField
                variant='filled'
                value={cartelera.precio_ticket}
                label='Precio por ticket de la cartelera'
                sx={{ display: 'block', margin: '1rem 0' }}
                name='precio_ticket'
                onChange={handleChange}
                inputProps={{ style: { color: 'black' } }}
                fullWidth
              />

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
                  !cartelera.precio_ticket ||
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

import React, { useEffect, useState } from 'react';
import { Typography, Card, CardContent, Button, Grid, CardMedia, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function CarteleraList() {
  const [carteleras, setCarteleras] = useState([]);
  const navigate = useNavigate();

  const loadCarteleras = async () => {
    try {
      const response = await fetch('http://localhost:4000/cartelera');
      const data = await response.json();
      setCarteleras(data);
    } catch (error) {
      console.error('Error loading carteleras:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/cartelera/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        throw new Error('Error deleting the event');
      }

      setCarteleras(carteleras.filter((event) => event.id !== id));
    } catch (error) {
      console.error('Failed to delete the event:', error);
    }
  };

  const formatTimeTo12Hour = (time24) => {
    const [hours, minutes, seconds] = time24.split(':');
    const period = +hours >= 12 ? 'PM' : 'AM';
    const hours12 = +hours % 12 || 12; 
    return `${hours12}:${minutes}:${seconds} ${period}`;
  };

  useEffect(() => {
    loadCarteleras();
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayEvents = carteleras.filter(event => event.fecha_inicio.split('T')[0] === today);
  const upcomingEvents = carteleras.filter(event => event.fecha_inicio.split('T')[0] > today);
  const pastEvents = carteleras.filter(event => event.fecha_inicio.split('T')[0] < today);

  const renderEventCard = (event) => (
    <Card style={{ marginBottom: '1rem', backgroundColor: '#f5f5f5' }}>
      <CardMedia
        component="img"
        alt={event.nombre}
        height="200"
        image={event.imagen_url}
        title={event.nombre}
        sx={{ 
          width: '100%', 
          height: '350px',
          objectFit: 'fill' 
        }}
      />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {event.nombre}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Categoría: {event.categoria}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Fecha: {new Date(event.fecha).toLocaleDateString('es-ES')}
        </Typography>
        <Typography variant="body2" color="textSecondary">
         Fecha de Inicio: {formatTimeTo12Hour(event.fecha_inicio)}
         -
         Fecha Final: {formatTimeTo12Hour(event.fecha_final)}
        </Typography>

        <Typography variant="body2" color="textSecondary">
          Sala: {event.sala_nombre}
        </Typography>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            variant='contained' 
            color='primary' 
            onClick={() => navigate(`/cartelera/${event.id}/edit`)}
          >
            Editar
          </Button>
          <Button 
            variant='contained' 
            color='secondary' 
            onClick={() => handleDelete(event.id)}
          >
            Eliminar
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Grid container spacing={2} padding={3}>
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Eventos Anteriores
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {pastEvents.length > 0 ? (
            pastEvents.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                {renderEventCard(event)}
              </Grid>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary">
              No hay eventos anteriores.
            </Typography>
          )}
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Eventos de Hoy
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {todayEvents.length > 0 ? (
            todayEvents.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                {renderEventCard(event)}
              </Grid>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary">
              No hay eventos programados para hoy.
            </Typography>
          )}
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Próximos Eventos
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                {renderEventCard(event)}
              </Grid>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary">
              No hay próximos eventos.
            </Typography>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}

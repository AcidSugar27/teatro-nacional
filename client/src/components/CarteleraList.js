import React, { useEffect, useState } from 'react';
import { Typography, Card, CardContent, Button, Grid, CardMedia } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

export default function CarteleraList() {
  const [carteleras, setCarteleras] = useState([]);
  const navigate = useNavigate();

  // Fetch carteleras from the API
  const loadCarteleras = async () => {
    try {
      const response = await fetch('http://localhost:4000/cartelera');
      const data = await response.json();
      setCarteleras(data);
    } catch (error) {
      console.error('Error loading carteleras:', error);
    }
  };

  // Delete a specific cartelera
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

  useEffect(() => {
    loadCarteleras();
  }, []);

  return (
    <Grid container spacing={2} padding={2}>
      {carteleras.map((event) => (
        <Grid item xs={12} sm={6} md={4} key={event.id}>
          <Card style={{ marginBottom: '1rem', backgroundColor: '#f5f5f5' }}>
            <CardMedia
              component="img"
              alt={event.nombre}
              height="200"
              image={event.imagen_url}
              title={event.nombre}
              sx={{ 
                width: '100%', 
                height: '200px',
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
                {dayjs(event.fecha_inicio).format('DD MMM YYYY')}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {dayjs(event.fecha_inicio).format('HH:mm')} - {dayjs(event.fecha_final).format('HH:mm')}
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
        </Grid>
      ))}
    </Grid>
  );
}

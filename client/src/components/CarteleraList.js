import React, { useEffect, useState } from 'react'
import { Typography,Card,CardContent, Button, Grid, CardMedia } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function CarteleraList() {

  const [cartelera, setCartelera] = useState([]);
  const navigate = useNavigate();

  const loadCartelera = async () => {
    const response = await fetch('http://localhost:4000/cartelera');
    const data = await response.json();
    setCartelera(data);
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/cartelera/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        throw new Error('Error deleting the event');
      }

      setCartelera(cartelera.filter((event) => event.id !== id));
    } catch (error) {
      console.error('Failed to delete the event:', error);
    }
  };

  useEffect(() => {
    loadCartelera();
  }, []);

  return (
    <Grid container spacing={2}>
      {cartelera.map((event) => (
        <Grid item xs={12} sm={6} md={4} key={event.id}>
          <Card style={{ marginBottom: '.7rem', backgroundColor: 'white' }}>
            <CardMedia
              component="img"
              alt={event.nombre}
              height="140"
              image={event.imagen_url}
              title={event.nombre}
              sx={{
                objectFit: 'fill'
              }}
            />
            <CardContent style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <Typography variant="h5">{event.nombre}</Typography>
                <Typography variant="body2" color="textSecondary">{event.categoria}</Typography>
                <Typography variant="body2" color="textSecondary">{event.fecha}</Typography>
                <Typography variant="body2" color="textSecondary">{event.hora_inicio} - {event.hora_final}</Typography>
              </div>
              <div>
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
                  style={{ marginLeft: '.5rem' }}
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
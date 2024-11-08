import React, { useEffect, useState } from 'react';
import { Typography, Card, CardContent, Button, Grid, CardMedia, Divider, IconButton } from '@mui/material';
import { ArrowBack, LocationOn, Book, Checkroom } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import './cartelera.css';

export default function CarteleraDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const navigate = useNavigate();
  
  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`http://localhost:4000/cartelera/${id}`);
      const data = await response.json();
      setEvent(data);
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id]);
  
  const formatTimeTo12Hour = (time24) => {
    const [hours, minutes] = time24.split(':');
    const period = +hours >= 12 ? 'PM' : 'AM';
    const hours12 = +hours % 12 || 12;
    return `${hours12}:${minutes} ${period}`;
  };

  

  const handleTicketPurchase = () => {
    // Verificar si el usuario está autenticado
    const isAuthenticated = Boolean(localStorage.getItem('token')); // o usar un contexto
    if (isAuthenticated) {
      // Redirigir a la ruta de compra de boletos de la cartelera
      navigate(`/cartelera/${id}/comprar`);
    } else {
      alert("Debe iniciar sesión para comprar boletos");
      navigate("/login");  // Redirigir al login si no está autenticado
    }
  };

  if (!event) {
    return <Typography variant="h6">Cargando...</Typography>;
  }

  return (
    <Grid container spacing={2} className="grid-container">
      <Grid item xs={12}>
        <Card style={{ backgroundColor: '#f5f5f5', overflow: 'hidden' }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBack /> {/* Back Arrow */}
          </IconButton>

          <Typography variant="h4" gutterBottom>{event.nombre}</Typography>

          <CardMedia
            component="img"
            alt={event.nombre}
            image={`http://localhost:4000${event.imagen_url}`}
            sx={{ height: '500px', objectFit: 'cover' }}
          />

          <CardContent>
            {/* Location */}
            <Typography variant="body1" color="textSecondary">
              <LocationOn /> Ubicación: {event.sala_nombre}
            </Typography>

            {/* Category */}
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Categoría: {event.categoria}
            </Typography>

            {/* Description */}
            <Typography variant="h6">
              <Book /> Descripción:
            </Typography>
            <Typography variant="body1" paragraph>{event.descripcion}</Typography>

            {/* Dress Code */}
            <Typography variant="h6">
              <Checkroom /> Código de vestimenta:
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Todo usuario debe cumplir con el código de vestimenta para ingresar a las salas de teatro nacional.
            </Typography>

            <Divider sx={{ mb: 2 }} />

            {/* Información de la cartelera */}
            <Typography variant="h6" gutterBottom>
              Información de la Cartelera
            </Typography>

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={3}>
                <Typography variant="body2">Fecha: {new Date(event.fecha).toLocaleDateString('es-ES')}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2">Inicio: {formatTimeTo12Hour(event.fecha_inicio)}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2">Fin: {formatTimeTo12Hour(event.fecha_final)}</Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="body2">Asientos disponibles: {event.asientos_disponibles}</Typography>
              </Grid>
            </Grid>

            {/* Botón de compra */}
            <Button
              variant="contained"
              color="primary"
              onClick={handleTicketPurchase} // Redirigir a la pantalla de compra de entradas
            >
              Comprar Boletos
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}


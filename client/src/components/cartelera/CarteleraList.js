import React, { useEffect, useState } from 'react';
import { Typography, Card, CardContent, Button, Grid, CardMedia, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './cartelera.css'; 

export default function CarteleraList() {
  const [carteleras, setCarteleras] = useState([]);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null); // Para almacenar el rol del usuario

  const loadCarteleras = async () => {
    try {
      const response = await fetch('http://localhost:4000/cartelera');
      const data = await response.json();
      setCarteleras(data);
    } catch (error) {
      console.error('Error loading carteleras:', error);
    }
  };

  // Función para obtener el rol del usuario como en el Navbar
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
        setUserRole(data.rol); // Asignar el rol del usuario
      })
      .catch(error => {
        console.error('Error fetching user role:', error);
      });
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

  

  useEffect(() => {
    loadCarteleras();
    fetchUserRole(); // Llamar a la función para obtener el rol del usuario
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayEvents = carteleras.filter(event => event.fecha.split('T')[0] === today);
  const upcomingEvents = carteleras.filter(event => event.fecha.split('T')[0] > today);
  const pastEvents = carteleras.filter(event => event.fecha.split('T')[0] < today);

  const renderEventCard = (event) => (
    <Card 
      style={{ 
        marginBottom: '1rem', 
        backgroundColor: '#f5f5f5', 
        position: 'relative', 
        overflow: 'hidden' 
      }}
    >
      <CardMedia
        component="img"
        alt={event.nombre}
        height="200"
        image={`http://localhost:4000${event.imagen_url}`}  // URL completa de la imagen
        title={event.nombre}
        sx={{ 
          width: '100%', 
          height: '450px',
          objectFit: 'cover', 
          transition: 'transform 0.3s ease-in-out',
          '&:hover': { transform: 'scale(1.05)' } // Hover effect for slight zoom
        }}
        onClick={() => navigate(`/cartelera/${event.id}`)} // Navigate to carteleradetails.js on click
      />
      <CardContent 
        sx={{ 
          position: 'absolute', 
          bottom: -10, 
          width: '91%', 
          color: '#fff', 
          backgroundColor: 'rgba(0, 0, 0,10)', 
          textAlign: 'center',
          flexDirection: 'column',
          padding:'',
          
           
        }}
      >
        
        <Typography variant="h5"  sx={{marginTop:'0px', }}>
          {event.nombre}
        </Typography>
        <Typography variant="body2" sx={{marginTop:'20px'}} >
          {new Date(event.fecha).toLocaleDateString('es-ES')} {/* Show date on hover */}
        </Typography>
      </CardContent>
      
      {userRole === 'admin' && (
        <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'space-between', padding: '0.18rem' }}>
          <Button 
            variant='contained' 
            color='primary' 
            onClick={() => navigate(`/cartelera/${event.id}/edit`)}
            sx={{ backgroundColor:'' }}
          >
            Editar
          </Button>
          <Button 
            variant='contained' 
            color='error' 
            onClick={() => handleDelete(event.id)}
          >
            Eliminar
          </Button>
        </div>
      )}
    </Card>
  );
  

  return (
    <Grid container  padding={3} style={{backgroundColor:''}} >
      {/* Eventos Anteriores */}
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Eventos Anteriores
        </Typography>
        <Divider sx={{ mb: 2,backgroundColor:'black' }} />
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

      {/* Eventos de Hoy */}
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Eventos de Hoy
        </Typography>
        <Divider sx={{ mb: 2, backgroundColor:'black' } } />
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

      {/* Próximos Eventos */}
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Próximos Eventos
        </Typography>
        <Divider sx={{ mb: 2, backgroundColor:'black' }} />
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

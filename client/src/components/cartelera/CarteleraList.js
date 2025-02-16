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

  //obtener el rol de usuario
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
    fetchUserRole(); // Obtener el rol del usuario
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayEvents = carteleras.filter(event => event.fecha.split('T')[0] === today);
  const upcomingEvents = carteleras.filter(event => event.fecha.split('T')[0] > today);
  const pastEvents = carteleras.filter(event => event.fecha.split('T')[0] < today);

  const renderEventCard = (event) => (
    <Card 
      style={{ 
        marginBottom: '2rem', 
        backgroundColor: '#f5f5f5', 
        position: 'relative', 
        overflow: 'hidden',
        padding: '', 
      }}
    >
      <CardMedia
        component="img"
        alt={event.nombre}
        height="200"
        image={`http://localhost:4000${event.imagen_url}`}  
        title={event.nombre}
        sx={{ 
          width: '100%', 
          height: '380px',
          objectFit: 'cover', 
          padding: "",
         
    
          transition: 'transform 0.3s ease-in-out',
          '&:hover': { transform: 'scale(1.05)' } 
        }}
        onClick={() => navigate(`/cartelera/${event.id}`)}
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
          {new Date(event.fecha).toLocaleDateString('es-ES')}
        </Typography>
      </CardContent>
      
      {userRole === 'admin' && (
        <div style={{  marginTop: '2.5rem', display: 'flex', justifyContent: 'space-between', padding: '0.15rem' }}>
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
    <Grid container maxWidth="false"   padding={2} style={{backgroundColor:''}} >
      
      <Grid item md={12} >
        <Typography variant="h5" gutterBottom>
          Eventos Anteriores
        </Typography>
        <Divider sx={{ mb: 3,backgroundColor:'black' }} />
        <Grid container spacing={3}>
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

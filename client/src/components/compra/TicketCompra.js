import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography, Grid, TextField, Card, CardContent, Divider, Box, List, ListItem, ListItemText } from '@mui/material';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

export default function TicketCompra() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [error, setError] = useState(null);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4000/cartelera/${id}`);
        if (!response.ok) throw new Error('Error al cargar los detalles del evento.');
        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError('Error al cargar los detalles del evento.');
      }
    };
    fetchEventDetails();
  }, [id]);

  const handleTicketCountChange = (e) => {
    const count = Math.max(1, parseInt(e.target.value) || 1);
    setTicketCount(count);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      console.log("Stripe no está disponible aún.");
      return;
    }

    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Usuario no autenticado.');

      const response = await fetch(`http://localhost:4000/cartelera/${id}/comprar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cantidad_tickets: ticketCount }),
      });

      if (!response.ok) {
        throw new Error('Error al iniciar la compra.');
      }

      const data = await response.json();
      const clientSecret = data.clientSecret;

      if (!clientSecret || typeof clientSecret !== 'string') {
        throw new Error('El backend no devolvió un client_secret válido.', clientSecret);
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('No se pudo obtener el elemento de la tarjeta.');
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          type: 'card',
          card: cardElement,
        },
      });

      if (stripeError) throw new Error(stripeError.message);

      if (paymentIntent.status === 'succeeded') {
        const confirmResponse = await fetch(`http://localhost:4000/cartelera/${id}/confirmar`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ payment_intent_id: paymentIntent.id }),
        });

        if (!confirmResponse.ok) {
          throw new Error('Error al confirmar la compra en la base de datos.');
        }

        alert('Compra realizada con éxito.');
        navigate(`/compras/${paymentIntent.id}`);
      } else {
        throw new Error('El pago no se completó.');
      }
    } catch (err) {
      setError(err.message || 'Ocurrió un error durante el pago.');
    }
  };

  if (error) return <Typography variant="h6" color="error">{error}</Typography>;
  if (!event) return <Typography variant="h6">Cargando detalles del evento...</Typography>;

  const TICKET_PRICE = event.precio_ticket;
  const SERVICE_FEE_PERCENTAGE = 0.05;
  const ADDITIONAL_FEES_PERCENTAGE = 0.08;

  const totalBase = TICKET_PRICE * ticketCount;
  const serviceFee = totalBase * SERVICE_FEE_PERCENTAGE;
  const additionalFees = totalBase * ADDITIONAL_FEES_PERCENTAGE;
  const totalAmount = Math.round(totalBase + serviceFee + additionalFees);

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>{event.nombre}</Typography>
            <Typography variant="body1" gutterBottom>Fecha: {new Date(event.fecha).toLocaleDateString('es-ES')}</Typography>
            <Typography variant="body2" gutterBottom>Asientos disponibles: {event.capacidad_sala - event.tickets_vendidos}</Typography>
            <TextField
              label="Cantidad de boletos"
              type="number"
              value={ticketCount}
              onChange={handleTicketCountChange}
              fullWidth
              margin="normal"
              inputProps={{ min: 1 }}
            />
            <Divider sx={{ my: 2 }} />
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>Detalles del pago</Typography>
              <List>
                <ListItem>
                  <ListItemText primary={`Precio por ticket: $${TICKET_PRICE}`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={`Tarifa de servicio (5%): $${serviceFee}`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={`Cargos adicionales (8%): $${additionalFees}`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={`Total: $${totalAmount.toFixed(2)} Pesos`} />
                </ListItem>
              </List>
            </Box>
            <form onSubmit={handlePayment}>
              <CardElement />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!stripe}
                fullWidth
                sx={{ mt: 2 }}
              >
                Pagar ahora
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Typography, Grid, TextField, Card, CardContent, Divider } from '@mui/material';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

export default function TicketCompra() {
  const { id } = useParams(); // Obtener el id de la cartelera
  const [event, setEvent] = useState(null);
  const [ticketCount, setTicketCount] = useState(1); // Número de boletos a comprar
  const [totalPrice, setTotalPrice] = useState(0); // Precio total
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const ticketPrice = 500; // Valor fijo de la boleta en pesos (equivalente a 10 USD)
  const serviceFeePercentage = 0.05; // 5% de servicio
  const additionalFeesPercentage = 0.08; // 8% de gastos adicionales

  // Fetch event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4000/cartelera/${id}`);
        const data = await response.json();
        setEvent(data);
        const total = ticketPrice * ticketCount;
        const serviceFee = total * serviceFeePercentage;
        const additionalFees = total * additionalFeesPercentage;
        setTotalPrice(total + serviceFee + additionalFees); // Calcular el precio total con cargos adicionales
      } catch (error) {
        console.error('Error fetching event details:', error);
        setError('Error al cargar los detalles de la cartelera.');
      }
    };
    fetchEventDetails();
  }, [id, ticketCount]);

  // Handler for ticket count change
  const handleTicketCountChange = (e) => {
    const count = Math.max(1, parseInt(e.target.value) || 1);
    setTicketCount(count);
    const total = ticketPrice * count;
    const serviceFee = total * serviceFeePercentage;
    const additionalFees = total * additionalFeesPercentage;
    setTotalPrice(total + serviceFee + additionalFees); // Actualizar el precio total
  };

  // Handle Stripe payment
  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    // Crear un pago en el backend
    const response = await fetch(`http://localhost:4000/cartelera/${id}/comprar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        cantidad: ticketCount,
        total: totalPrice,
      }),
    });

    const paymentIntent = await response.json();

    // Usar Stripe para confirmar el pago
    const { error: stripeError, paymentIntent: stripePaymentIntent } = await stripe.confirmCardPayment(
      paymentIntent.clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      }
    );

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
    } else if (stripePaymentIntent.status === 'succeeded') {
      // Confirmar compra en el backend
      const confirmResponse = await fetch(`http://localhost:4000/cartelera/${id}/confirmar-compra`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          cantidad: ticketCount,
          total: totalPrice,
          paymentIntentId: stripePaymentIntent.id,
        }),
      });

      const result = await confirmResponse.json();

      if (result.success) {
        setLoading(false);
        alert('Compra realizada con éxito');
        navigate(`/cartelera/${id}`);
      } else {
        setError('Error al confirmar la compra.');
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <Typography variant="h6">Procesando pago...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>;
  }

  if (!event) {
    return <Typography variant="h6">Cargando detalles de la cartelera...</Typography>;
  }

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h5">{event.nombre}</Typography>
            <Typography variant="body1">Fecha: {new Date(event.fecha).toLocaleDateString('es-ES')}</Typography>
            <Typography variant="body2">Asientos disponibles: {event.capacidad_sala - event.boletos_vendidos}</Typography>
            <Typography variant="body1">Precio por boleto: ${ticketPrice}</Typography>
            <TextField
              label="Cantidad de boletos"
              type="number"
              value={ticketCount}
              onChange={handleTicketCountChange}
              fullWidth
              margin="normal"
              inputProps={{ min: 1 }}
            />
            <Typography variant="h6">Total: ${totalPrice.toFixed(2)}</Typography>
            <Divider sx={{ my: 2 }} />
            <form onSubmit={handlePayment}>
              <CardElement />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!stripe || loading}
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



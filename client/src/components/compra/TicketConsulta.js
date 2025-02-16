import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';

export default function Ticketconsulta() {
  const [compras, setCompras] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompras = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/mis-ordenes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setCompras(data);
    };
    fetchCompras();
  }, []);

  return (
    <Grid container spacing={2}>
      {compras.map((compra) => (
        <Grid item xs={12} sm={6} md={4} key={compra.id}>
          <Card>
            <CardContent>
              <Typography variant="h6">{compra.evento_nombre}</Typography>
              <Typography>Cantidad de Tickets: {compra.cantidad_tickets}</Typography>
              <Typography>Status: {compra.status}</Typography>

              {/* Botón para ver factura si el estado es "completed" */}
              {compra.status === 'completed' && (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ marginTop: 2 }}
                  onClick={() => navigate(`/compras/${compra.payment_intent_id}`)}
                >
                  Ver Factura
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}


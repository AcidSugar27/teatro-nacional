import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';

export default function TicketTodos() {
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:4000/todas-las-ordenes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        // Asegurar que sea un array antes de actualizar el estado
        if (Array.isArray(data)) {
          setCompras(data);
        } else {
          setCompras([]); // Si no es un array, asignar un array vacío
          console.error("La respuesta del backend no es un array:", data);
        }
      } catch (error) {
        console.error("Error al obtener las compras:", error);
        setCompras([]);
      }
    };

    fetchCompras();
  }, []);

  return (
    <Grid container spacing={2}>
      {compras.length === 0 ? (
        <Typography variant="h6" style={{ margin: "20px" }}>No hay compras registradas.</Typography>
      ) : (
        compras.map((compra) => (
          <Grid item xs={12} sm={6} md={4} key={compra.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{compra.evento_nombre}</Typography>
                <Typography>Comprador: {compra.email}</Typography>
                <Typography>Cantidad de Tickets: {compra.cantidad_tickets}</Typography>
                <Typography>Status: {compra.status}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );
}

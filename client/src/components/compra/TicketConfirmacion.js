import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Card, CardContent, Button } from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function TicketConfirmacion() {
  const { payment_intent_id } = useParams();
  const [compra, setCompra] = useState(null);
  const [error, setError] = useState(null);
  const pdfRef = useRef(); 

  useEffect(() => {
    const fetchFactura = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Usuario no autenticado.');

        const response = await fetch(`http://localhost:4000/compras/${payment_intent_id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Error al obtener la factura.');
        const data = await response.json();
        setCompra(data);
      } catch (err) {
        setError(err.message || 'Ocurrió un error.');
      }
    };
    fetchFactura();
  }, [payment_intent_id]);

 
  const exportarPDF = async () => {
    const element = pdfRef.current; 
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF();
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    pdf.save(`ticket_${payment_intent_id}.pdf`);
  };

  if (error) return <Typography color="error">{error}</Typography>;
  if (!compra) return <Typography>Cargando factura...</Typography>;

  return (
    <Card sx={{ maxWidth: 500, margin: '20px auto', padding: 2 }}>
      <CardContent ref={pdfRef}>
        <Typography variant="h5" gutterBottom>
          Factura de Compra
        </Typography>
        <Typography variant="body1">Evento: {compra.evento_nombre}</Typography>
        <Typography variant="body1">Cantidad de Tickets: {compra.cantidad_tickets}</Typography>
        <Typography variant="body1">Payment Intent ID: {compra.payment_intent_id}</Typography>

        <Typography variant="h6" sx={{ marginTop: 2 }}>Código QR</Typography>
        <QRCodeCanvas value={compra.payment_intent_id} size={200} />
      </CardContent>

      {/* Botón para exportar el PDF */}
      <Button variant="contained" color="primary" onClick={exportarPDF} sx={{ marginTop: 2 }}>
        Descargar PDF
      </Button>
    </Card>
  );
}

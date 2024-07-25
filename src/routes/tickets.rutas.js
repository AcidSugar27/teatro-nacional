// routes.js

const express = require('express');
const ticketsController = require('\controllers\tickets.controller.js');

const router = express.Router();

// Ruta para obtener tickets disponibles por show ID
router.get('/shows/:showId/tickets', async (req, res) => {
  const { showId } = req.params;
  try {
    const tickets = await ticketsController.getTicketsByShowId(showId);
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Ruta para marcar un ticket como vendido
router.put('/tickets/:ticketId/sell', async (req, res) => {
  const { ticketId } = req.params;
  try {
    await ticketsController.markTicketAsSold(ticketId);
    res.status(204).end();
  } catch (error) {
    console.error('Error marking ticket as sold:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

// ticketsController.js

const knex = require('knex');
const db = knex(require('./knexfile')[process.env.NODE_ENV || 'development']);

// Función para obtener tickets disponibles por show
async function getTicketsByShowId(showId) {
  try {
    const tickets = await db('tickets')
      .where({ show_id: showId, status: 'available' })
      .select('*');
    return tickets;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
}

// Función para marcar un ticket como vendido
async function markTicketAsSold(ticketId) {
  try {
    await db('tickets')
      .where({ id: ticketId })
      .update({ status: 'sold' });
  } catch (error) {
    console.error('Error marking ticket as sold:', error);
    throw error;
  }
}

module.exports = {
  getTicketsByShowId,
  markTicketAsSold,
};

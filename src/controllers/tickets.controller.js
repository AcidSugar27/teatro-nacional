const stripe = require('stripe')("sk_test_51QIsRaHlnQXc8B6sGrkz0TsDUJhNMpDwq1Br5PRTrfV3h2yhS4Us4rXLQvIBoJ2eRemXBfCMNOHNx2LvjgdzrDBf00k59PsV17");
const pool = require('../db'); 


const comprarTickets = async (req, res, next) => {
    try {
        const { id } = req.params; // ID de la cartelera
        const { cantidad_tickets } = req.body; // Cantidad de tickets solicitada
        const user_id = req.user.id; // ID del usuario autenticado

        // Obtener información de la cartelera y verificar disponibilidad
        const result = await pool.query(
            `SELECT c.*, s.capacidad AS sala_capacidad, c.tickets_vendidos, c.precio_ticket 
             FROM cartelera c 
             LEFT JOIN sala s ON c.sala_id = s.id 
             WHERE c.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Evento no encontrado" });
        }

        const cartelera = result.rows[0];
        const asientos_disponibles = cartelera.sala_capacidad - cartelera.tickets_vendidos;

        if (cantidad_tickets > asientos_disponibles) {
            return res.status(400).json({ message: "No hay suficientes asientos disponibles" });
        }

        const TICKET_PRICE = cartelera.precio_ticket; 
        const SERVICE_FEE_PERCENTAGE = 0.05; 
        const ADDITIONAL_FEES_PERCENTAGE = 0.08; 
        console.log('precio del ticket: ', cartelera.precio_ticket);
        const totalBase = TICKET_PRICE * cantidad_tickets;
        const serviceFee = totalBase * SERVICE_FEE_PERCENTAGE;
        const additionalFees = totalBase * ADDITIONAL_FEES_PERCENTAGE;
        const totalAmount = Math.round(totalBase + serviceFee + additionalFees); 

        // Crear el intento de pago con Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount, 
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
              },
        });

        

        // Registrar la compra en la base de datos con estado 'pending'
        await pool.query(
            `INSERT INTO compras (user_id, cartelera_id, cantidad_tickets, payment_intent_id, status) 
             VALUES ($1, $2, $3, $4, 'pending')`,
            [user_id, id, cantidad_tickets, paymentIntent.id]
        );

        console.log('client_secret generado: ', paymentIntent.client_secret);

        res.json({ clientSecret: paymentIntent.client_secret });

        // Enviar client_secret al frontend
       
    } catch (error) {
        next(error);
    }
};

//Funcion para confirmar la compra
const confirmarCompra = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const { payment_intent_id } = req.body;

        // Recuperar el intento de pago de Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);

        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({ message: "El pago no se ha completado" });
        }

        // Verificar que exista la compra pendiente en la base de datos
        const compra = await pool.query(
            `SELECT * FROM compras WHERE payment_intent_id = $1 AND cartelera_id = $2`,
            [payment_intent_id, id]
        );

        if (compra.rows.length === 0) {
            return res.status(404).json({ message: "Compra no encontrada o cartelera incorrecta" });
        }

        const { cantidad_tickets } = compra.rows[0];

        // Actualizar tickets vendidos en la cartelera
        await pool.query(
            `UPDATE cartelera SET tickets_vendidos = tickets_vendidos + $1 WHERE id = $2`,
            [cantidad_tickets, id]
        );

        // Marcar la compra como completada
        await pool.query(
            `UPDATE compras SET status = 'completed' WHERE payment_intent_id = $1`,
            [payment_intent_id]
        );

        res.json({ message: "Compra confirmada con éxito" });
    } catch (error) {
        next(error);
    }
};
const obtenerCompra = async (req, res) => {
    try {
        const { payment_intent_id } = req.params;
        const result = await pool.query(
            `SELECT c.*, e.nombre AS evento_nombre 
             FROM compras c 
             JOIN cartelera e ON c.cartelera_id = e.id 
             WHERE c.payment_intent_id = $1`,
            [payment_intent_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Compra no encontrada." });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la compra." });
    }
};






module.exports = {
    comprarTickets,
    confirmarCompra,
    obtenerCompra
};


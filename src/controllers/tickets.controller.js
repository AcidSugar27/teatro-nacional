const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const pool = require('../db'); // Suponiendo que estás usando pg-pool o una librería similar para interactuar con PostgreSQL

// Controlador para comprar tickets asociados a una cartelera específica
const comprarTickets = async (req, res, next) => {
    try {
        const { id } = req.params; // id de la cartelera o función
        const { cantidad_tickets } = req.body; // Cantidad de tickets a comprar
        const user_id = req.user.id; // ID del usuario autenticado

        // Obtener la cartelera o función específica y su capacidad
        const result = await pool.query(
            `SELECT c.*, s.capacidad AS sala_capacidad, c.tickets_vendidos FROM cartelera c 
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

        // Crear la sesión de pago con Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: cartelera.nombre,
                        },
                        unit_amount: 1000, // Precio por ticket (en centavos)
                    },
                    quantity: cantidad_tickets,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/compra-exitosa`,
            cancel_url: `${process.env.CLIENT_URL}/cartelera/${id}`,
        });

        // Registrar la compra en la base de datos (con estado 'pending')
        await pool.query(
            `INSERT INTO compras (user_id, cartelera_id, cantidad_tickets, session_id, status) 
             VALUES ($1, $2, $3, $4, 'pending')`, 
            [user_id, id, cantidad_tickets, session.id]
        );

        // Enviar la URL para la sesión de Stripe al frontend
        res.json({ url: session.url });
    } catch (error) {
        next(error);
    }
};

// Controlador para confirmar la compra y actualizar los tickets vendidos
const confirmarCompra = async (req, res, next) => {
    const { id } = req.params; // id de la cartelera o función
    const { session_id } = req.body;

    try {
        // Obtener la sesión de Stripe y verificar si el pago fue realizado
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status !== 'paid') {
            return res.status(400).json({ message: "El pago no se ha completado" });
        }

        // Obtener los detalles de la compra desde la base de datos
        const compra = await pool.query(
            `SELECT * FROM compras WHERE session_id = $1 AND cartelera_id = $2`, 
            [session_id, id]
        );

        if (compra.rows.length === 0) {
            return res.status(404).json({ message: "Compra no encontrada o cartelera incorrecta" });
        }

        const { cantidad_tickets } = compra.rows[0];

        // Actualizar el conteo de tickets vendidos en la cartelera
        await pool.query(
            `UPDATE cartelera SET tickets_vendidos = tickets_vendidos + $1 WHERE id = $2`,
            [cantidad_tickets, id]
        );

        // Marcar la compra como completada
        await pool.query(
            `UPDATE compras SET status = 'completed' WHERE session_id = $1`,
            [session_id]
        );

        res.json({ message: "Compra realizada con éxito" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    comprarTickets, // Asegúrate de que esté exportado correctamente
    confirmarCompra
};


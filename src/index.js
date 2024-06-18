const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

const carteleraroutes = require('./routes/cartelera.rutas');
const loginroutes = require("./routes/login.rutas.js")

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

app.use(carteleraroutes, loginroutes)

app.use((err, req, res, next) => {
    return res.json({
        message: err.message
    })
})

app.listen(4000)
console.log('Server on port 4000')



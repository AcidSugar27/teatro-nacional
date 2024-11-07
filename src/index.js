const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

const carteleraroutes = require('./routes/cartelera.rutas');
const loginroutes = require("./routes/login.rutas.js")
const salaroutes = require("./routes/sala.rutas.js")

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use('/uploads', express.static('uploads'));


app.use(carteleraroutes, loginroutes, salaroutes)

app.use((err, req, res, next) => {
    return res.json({
        message: err.message
    })
})

app.listen(4000)
console.log('Server on port 4000')



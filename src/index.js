const express = require('express');
const morgan = require('morgan');

const app = express();

const taskroutes = require('./routes/tasks.rutas');


app.use(morgan('dev'))

app.use(taskroutes)

app.listen(4000)
console.log('Server on port 4000')



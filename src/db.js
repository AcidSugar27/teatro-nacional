const {Pool} = require('pg')

new Pool({
    user:'postgres',
    password:'123',
    host:'localhost',
    port: 5432,
    database:''
})
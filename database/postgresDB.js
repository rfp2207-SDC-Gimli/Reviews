const Pool = require('pg').Pool
require("dotenv").config();


const pool = new Pool({
  user: process.env.DB_USER,
  host: 'localhost',
  database: process.env.DB_NAME,
  password: '',
  port: process.env.DB_PORT
})

pool.connect();
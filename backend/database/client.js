// db.js
const postgres = require('postgres')

const connectionString = process.env.POSTGRES_CONNECTION_STRING


const sql = postgres(connectionString)

module.exports = sql


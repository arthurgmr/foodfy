const { Pool } = require("pg")

module.exports = new Pool({
    user: "postgres",
    password: "agmr1275",
    host: "localhost",
    port: 5432,
    database: "projeto_foodfy"
})
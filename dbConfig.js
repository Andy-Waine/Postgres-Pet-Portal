require("dotenv").config();

const { Pool } = require("pg");


const isProduction = process.env.NODE_ENV === "production";

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "nodelogin",
    password: "password",
    port: "5432",
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:mniAMW13!@localhost:5432/nodelogin',
    ssl: process.env.DATABASE_URL ? true : false
});


module.exports = { pool };
const { Pool } = require('pg');

const host1 = process.env.HOST || 'localhost';
const user1 = process.env.USER || 'postgres';
const password1 = process.env.PASSWORD || '00000000';
const database1 = process.env.DATABASE || 'todolist';
const port1 = process.env.PORTDB || '5432';

const db = new Pool({
    host: host1,
    user: user1,
    password: password1,
    database: database1,
    port: port1,
})

module.exports = db;

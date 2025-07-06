// server/src/db.js
const { Pool } = require("pg");

// @ts-ignore
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
module.exports = pool;

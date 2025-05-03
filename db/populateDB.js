const { Pool } = require("pg");
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const createTableQuery = `
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_member BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`

async function populateDB() {
  try {
    await pool.connect();
    await pool.query(createTableQuery);
    console.log("Tables created(if not exists)");

    pool.end();
  } catch (err) {
    console.error("Error populating db:", err);
    pool.end();
  }
}

populateDB();
const { Pool } = require("pg");
require('dotenv').config();

// Debug log to check if DATABASE_URL is loaded
console.log('Database URL:', process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: {
  //   rejectUnauthorized: false
  // }
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Successfully connected to the database');
    release();
  }
});

async function createUser(username, firstName, lastName, hashedPassword) {
  try {
    const insertQuery = "INSERT INTO users (username, first_name, last_name, password, is_member) values ($1, $2, $3, $4, false)";
    await pool.query(insertQuery, [username, firstName, lastName, hashedPassword]);
  } catch (error) {
    console.error("Error creating User: ", error);
    throw error;
  }
}

async function getUserByUsername(username) {
  try {
    const userQuery = "SELECT * FROM users WHERE username = $1";
    const res = await pool.query(userQuery, [username]);
    const user = res.rows[0];  //we do res.rows[0] becauser "pg" always returns .rows as an array, even if there is only 1 result.
    return user;
  } catch (err) {
    console.error("Error fetching user: ", err);
    throw err;
  }
}

async function getUserbyId(id) {
  try {
    const userQuery = "SELECT * FROM users WHERE id = $1";
    const res = await pool.query(userQuery, [id]);
    return res.rows[0];
  } catch (error) {
    console.error("Error fetching user by Id: ", error);
    throw error;
  }
}

// async function updateMembershipStatus(userId) {
//   try {
//     const updateQuery = "UPDATE users SET is_member = true WHERE id = $1";
//     await pool.query(updateQuery, [userId]);
//   } catch (error) {
//     console.error("Error updating membership status: ", error);
//     throw error;
//   }
// }

// async function createMessage(userId, title, content) {
//   try {
//     const insertQuery = "INSERT INTO messages (user_id, title, content) VALUES ($1, $2, $3)";
//     await pool.query(insertQuery, [userId, title, content]);
//   } catch (error) {
//     console.error("Error creating message: ", error);
//     throw error;
//   }
// }

// async function getAllMessages(isMember) {
//   try {
//     if (isMember) {
//       const query = `
//         SELECT m.*, u.first_name, u.last_name 
//         FROM messages m 
//         JOIN users u ON m.user_id = u.id 
//         ORDER BY m.created_at DESC
//       `;
//       const result = await pool.query(query);
//       return result.rows;
//     } else {
//       const query = "SELECT id, title, content, created_at FROM messages ORDER BY created_at DESC";
//       const result = await pool.query(query);
//       return result.rows;
//     }
//   } catch (error) {
//     console.error("Error fetching messages: ", error);
//     throw error;
//   }
// }

module.exports = {
  createUser,
  getUserByUsername,
  getUserbyId,
  // updateMembershipStatus,
  // createMessage,
  // getAllMessages
};
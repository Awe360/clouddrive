const db = require('../config/db');

/**
 * Find user by email
 * @param {string} email
 * @returns {Promise<object|null>} user or null
 */
async function findByEmail(email) {
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
}

/**
 * Find user by ID
 * @param {number} id
 * @returns {Promise<object|null>} user profile (without password) or null
 */
async function findById(id) {
  const [rows] = await db.execute('SELECT id, name, email, created_at FROM users WHERE id = ?', [id]);
  return rows[0] || null;
}

/**
 * Create a new user
 * @param {object} user
 * @param {string} user.name
 * @param {string} user.email
 * @param {string} user.password
 * @returns {Promise<number>} new user ID
 */
async function create({ name, email, password }) {
  const [result] = await db.execute(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, password]
  );
  return result.insertId;
}

/**
 * Update user details
 * @param {number} id
 * @param {object} updates
 * @param {string} updates.name
 * @param {string} updates.email
 * @returns {Promise<boolean>} success
 */
async function updateById(id, { name, email }) {
  const [result] = await db.execute(
    'UPDATE users SET name = ?, email = ? WHERE id = ?',
    [name, email, id]
  );
  return result.affectedRows > 0;
}

module.exports = {
  findByEmail,
  findById,
  create,
  updateById
};

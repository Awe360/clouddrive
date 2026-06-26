const db = require('../config/db');

/**
 * Find all files uploaded by a user
 * @param {number} userId
 * @returns {Promise<Array>} array of file objects
 */
async function findByUserId(userId) {
  const [rows] = await db.execute(
    'SELECT * FROM files WHERE user_id = ? ORDER BY uploaded_at DESC',
    [userId]
  );
  return rows;
}

/**
 * Find a specific file by its ID
 * @param {number} id
 * @returns {Promise<object|null>} file object or null
 */
async function findById(id) {
  const [rows] = await db.execute('SELECT * FROM files WHERE id = ?', [id]);
  return rows[0] || null;
}

/**
 * Record a new file upload in the database
 * @param {object} file
 * @param {number} file.user_id
 * @param {string} file.filename
 * @param {string} file.s3_key
 * @param {number} file.size_bytes
 * @param {string} file.mime_type
 * @returns {Promise<number>} new file ID
 */
async function create({ user_id, filename, s3_key, size_bytes, mime_type }) {
  const [result] = await db.execute(
    'INSERT INTO files (user_id, filename, s3_key, size_bytes, mime_type) VALUES (?, ?, ?, ?, ?)',
    [user_id, filename, s3_key, size_bytes, mime_type]
  );
  return result.insertId;
}

/**
 * Delete a file record from the database by ID
 * @param {number} id
 * @returns {Promise<boolean>} success
 */
async function deleteById(id) {
  const [result] = await db.execute('DELETE FROM files WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

/**
 * Get storage stats for a user (count, total size)
 * @param {number} userId
 * @returns {Promise<object>} count and total_bytes
 */
async function getStatsByUserId(userId) {
  const [rows] = await db.execute(
    'SELECT COUNT(*) as count, COALESCE(SUM(size_bytes), 0) as total_bytes FROM files WHERE user_id = ?',
    [userId]
  );
  return {
    count: parseInt(rows[0].count, 10),
    total_bytes: parseInt(rows[0].total_bytes, 10)
  };
}

module.exports = {
  findByUserId,
  findById,
  create,
  deleteById,
  getStatsByUserId
};

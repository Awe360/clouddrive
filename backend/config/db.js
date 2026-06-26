const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '@Awoke7012',
  database: process.env.DB_NAME || 'clouddrive',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Enable SSL configuration for production environments (e.g. AWS RDS)
if (process.env.NODE_ENV === 'production') {
  // RDS database endpoints support SSL/TLS connections
  dbConfig.ssl = {
    rejectUnauthorized: true
  };
}

console.log(`Initializing MySQL Connection Pool to ${dbConfig.host}:${dbConfig.port}...`);
const pool = mysql.createPool(dbConfig);

module.exports = pool;

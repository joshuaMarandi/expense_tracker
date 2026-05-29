const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const expenseRoutes = require('./routes/expenses');
const pool = require('./db');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Serve static files (UI)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Initialize database on startup
async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    
    // Create database if it doesn't exist
    const createDatabaseSQL = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`;
    await connection.query(createDatabaseSQL);
    
    // Create expenses table if it doesn't exist
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS expenses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        amount DECIMAL(10, 2) NOT NULL,
        category VARCHAR(50) NOT NULL,
        description VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    await connection.query(createTableSQL);
    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error.message);
    process.exit(1);
  }
}

// Routes
app.use('/api/expenses', expenseRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Expense Tracker API is running' });
});

// Serve index.html for all other routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// 404 handler (for API routes)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

// Start server
async function startServer() {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`UI: http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);

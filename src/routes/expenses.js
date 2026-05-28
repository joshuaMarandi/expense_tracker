const express = require('express');
const router = express.Router();
const pool = require('../db');

// Add expense
router.post('/', async (req, res) => {
  const { amount, category, description } = req.body;

  if (!amount || !category) {
    return res.status(400).json({ error: 'Amount and category are required' });
  }

  try {
    const connection = await pool.getConnection();
    await connection.query(
      'INSERT INTO expenses (amount, category, description) VALUES (?, ?, ?)',
      [amount, category, description || '']
    );
    connection.release();
    res.status(201).json({ message: 'Expense added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all expenses with optional category filter
router.get('/', async (req, res) => {
  const { category } = req.query;

  try {
    const connection = await pool.getConnection();
    let query = 'SELECT * FROM expenses';
    let params = [];

    if (category) {
      query += ' WHERE category = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC';
    const [rows] = await connection.query(query, params);
    connection.release();
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get expense by ID
router.get('/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM expenses WHERE id = ?', [req.params.id]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query('DELETE FROM expenses WHERE id = ?', [req.params.id]);
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
